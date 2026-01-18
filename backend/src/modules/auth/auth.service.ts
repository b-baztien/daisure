import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { LineLoginDto } from './dto/line-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if email exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.usersService.create({
      email: registerDto.email,
      password: registerDto.password,
      displayName: registerDto.displayName,
      phone: registerDto.phone,
    });

    const tokens = await this.generateTokens(user._id.toString(), user.role);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return {
      user: {
        id: user._id,
        email: user.auth.email,
        displayName: user.profile.displayName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validatePassword(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.role);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );
    await this.usersService.updateLastLogin(user._id.toString(), 'web');

    return {
      user: {
        id: user._id,
        email: user.auth.email,
        displayName: user.profile.displayName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async lineLogin(lineLoginDto: LineLoginDto) {
    try {
      // Validate LINE configuration
      const redirectUri = this.configService.get<string>('line.redirectUri');
      const clientId = this.configService.get<string>('line.channelId');
      const clientSecret = this.configService.get<string>('line.channelSecret');

      // Log configuration values (mask sensitive data)
      console.log('LINE configuration check:', {
        redirectUri: redirectUri ? `${redirectUri.substring(0, 30)}...` : 'MISSING',
        clientId: clientId ? `${clientId.substring(0, 10)}...` : 'MISSING',
        hasClientSecret: !!clientSecret,
        redirectUriType: typeof redirectUri,
        redirectUriLength: redirectUri?.length || 0,
      });

      // Strict validation - check for empty strings and trim
      const validRedirectUri = redirectUri?.trim();
      const validClientId = clientId?.trim();
      const validClientSecret = clientSecret?.trim();

      if (!validRedirectUri || !validClientId || !validClientSecret) {
        console.error('LINE configuration validation failed:', {
          hasRedirectUri: !!validRedirectUri,
          hasClientId: !!validClientId,
          hasClientSecret: !!validClientSecret,
          redirectUriValue: redirectUri,
          clientIdValue: clientId,
        });
        throw new UnauthorizedException(
          'LINE login is not properly configured on the server. Please check LINE_REDIRECT_URI, LINE_CHANNEL_ID, and LINE_CHANNEL_SECRET environment variables.',
        );
      }

      // Log the request parameters (for debugging)
      console.log('LINE token exchange request:', {
        code: lineLoginDto.code?.substring(0, 20) + '...',
        redirect_uri: validRedirectUri,
        client_id: validClientId,
      });

      // Step 1: Exchange authorization code for access token
      const tokenResponse = await axios.post(
        'https://api.line.me/oauth2/v2.1/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: lineLoginDto.code,
          redirect_uri: validRedirectUri,
          client_id: validClientId,
          client_secret: validClientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const accessToken = tokenResponse.data.access_token;

      // Step 2: Get LINE profile using access token
      const profileResponse = await axios.get(
        'https://api.line.me/v2/profile',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const lineProfile = profileResponse.data;

      // Step 3: Find or create user
      let user = await this.usersService.findByLineUserId(lineProfile.userId);

      if (!user) {
        user = await this.usersService.create({
          lineUserId: lineProfile.userId,
          displayName: lineProfile.displayName,
          pictureUrl: lineProfile.pictureUrl,
        });
      }

      // Step 4: Generate JWT tokens
      const tokens = await this.generateTokens(user._id.toString(), user.role);
      await this.usersService.updateRefreshToken(
        user._id.toString(),
        tokens.refreshToken,
      );
      await this.usersService.updateLastLogin(user._id.toString(), 'line');

      return {
        user: {
          id: user._id,
          lineUserId: user.auth.lineUserId,
          displayName: user.profile.displayName,
          pictureUrl: user.profile.pictureUrl,
          role: user.role,
        },
        ...tokens,
      };
    } catch (error) {
      // Log detailed error information
      if (error.response) {
        console.error('LINE API error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        // Return specific error message from LINE API
        const lineError = error.response.data;
        if (lineError?.error_description) {
          throw new UnauthorizedException(
            `LINE login failed: ${lineError.error_description}`,
          );
        }
        if (lineError?.error) {
          throw new UnauthorizedException(
            `LINE login failed: ${lineError.error}`,
          );
        }
      }

      console.error('LINE login error:', error.message);
      throw new UnauthorizedException(
        error.message || 'Invalid LINE authorization code',
      );
    }
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findOne(userId);
    const tokens = await this.generateTokens(user._id.toString(), user.role);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
