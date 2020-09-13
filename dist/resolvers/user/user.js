"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("./types");
const User_1 = require("../../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const uuid_1 = require("uuid");
let UserResolver = class UserResolver {
    register(options, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username: options.username });
            if (user)
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username already exists, try another username.",
                        },
                    ],
                };
            const hashedPassword = yield argon2_1.default.hash(options.password);
            const newUser = em.create(User_1.User, {
                id: uuid_1.v1({ msecs: new Date().getTime() }),
                username: options.username,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            yield em.persistAndFlush(newUser);
            return { user: newUser };
        });
    }
    login(options, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username: options.username });
            if (!user)
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username does not exist!",
                        },
                    ],
                };
            const validate = yield argon2_1.default.verify(user.password, options.password);
            if (!validate)
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Password is invalid!",
                        },
                    ],
                };
            return {
                user,
            };
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => types_1.UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map