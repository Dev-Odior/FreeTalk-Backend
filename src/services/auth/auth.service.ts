import { BadRequestError, ConflictError } from "@src/errors";
import jwt from "jsonwebtoken";
import { authConfig } from "@src/configs";
import { User } from "@src/models/user.model";
import { UserAttributeI, UserModel } from "@src/interfaces/user.interface";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

class AuthService {
  private AuthEncryptKey = fs
    .readFileSync(path.join(process.cwd(), "private.key"))
    .toString();

  constructor(private UserModel: typeof User) {}

  public login(user: UserAttributeI) {
    const removedPassword = this.removeUserPassword(user);
    const accessToken = this.generateAccessToken(removedPassword);
    return { user: removedPassword, accessToken };
  }

  public async register(name: string, email: string, password: string) {
    const userExits = await this.userExistenceChecker(email);

    if (userExits) {
      throw new ConflictError("Cannot use this email as user already exist");
    } else {
      const user = this.UserModel.build({ name, email, password });
      await user.save();
      return user;
    }
  }

  public removeUserPassword(user: UserAttributeI) {
    const { password, ...withoutPassword } = user.toJSON();
    const payload = withoutPassword as UserAttributeI;
    return payload;
  }

  public async getUserInformation(email: string, password: string) {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new BadRequestError("Email is not correct");
    }

    if (!this.validatePassword(user, password)) {
      throw new BadRequestError("Password is incorrect, Please check details");
    }

    return user;
  }

  public generateAccessToken(user: Partial<UserAttributeI>): string {
    const accessToken = jwt.sign({ ...user }, this.AuthEncryptKey, {
      algorithm: "RS256",
      expiresIn: authConfig.ACCESS_TOKEN_EXPIRES_IN,
    });

    return accessToken;
  }

  protected validatePassword(user: UserAttributeI, password: string) {
    try {
      return bcrypt.compareSync(password, user.password);
    } catch (error) {
      throw new BadRequestError("Error validation password at this time");
    }
  }

  private async userExistenceChecker(email: string): Promise<boolean> {
    const user = await this.UserModel.findOne({ email: email });
    return !!user;
  }
}

export default new AuthService(User);
