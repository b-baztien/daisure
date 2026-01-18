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
      // Step 1: Exchange authorization code for access token
      const tokenResponse = await axios.post(
        'https://api.line.me/oauth2/v2.1/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: lineLoginDto.code,
          redirect_uri: this.configService.get('line.redirectUri'),
          client_id: this.configService.get('line.channelId'),
          client_secret: this.configService.get('line.channelSecret'),
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
      console.error('LINE login error:', error.response?.data || error.message);
      throw new UnauthorizedException('Invalid LINE authorization code');
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
