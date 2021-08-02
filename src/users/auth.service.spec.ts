import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create fake copy of user service
    const users: User[] = [];
    
    fakeUsersService = {
      find: (email: string) => {
        const filteredusers = users.filter(user => user.email === email);
        return Promise.resolve(filteredusers);
      },
      create: (email: string, password: string) => {
        const user = {id: Math.floor(Math.random() * 99999), email, password};
        users.push(user);
        return Promise.resolve(user)
      }
    }

    // create fake di container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  })

  it('should create an instance of auth service', async () => {
    expect(service).toBeDefined();  
  })

  describe('when creating a new user', () => {
    describe('and user provides valid email and password', () => {
      const email = 'tester@test.com';
      const password = 'strongPassword';
      
      it('should hash password before saving', async() => {
        const user = await service.signup(email, password);
        expect(user.password).not.toEqual(password);
      })
      
      it('should generate password with salt', async() => {
        const user = await service.signup(email, password);
        const [salt, hash] = user.password.split('.');      
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
      })
    })  
    
    describe('and user already exists with email provided', () => {
      const email = 'tester2@test.com';
      const password = 'strongPassword';
      
      
      it('should throw BadRequestException', async () => {
        fakeUsersService.find = () => Promise.resolve([{id: 1, email, password } as User]);

        try {
          await service.signup(email, password);
        } catch (error) {          
          expect(error).toBeInstanceOf(BadRequestException);
        }
      })
    })
  })

  describe('when logging in a user', () => {
    describe('and user provides a valid email and password', () => {
      const email = "unknown@test.com";
      const password = "randomePassword";
      const hashedPassword = '6035d171d0c374bc.a2c6d9d2831ada894f8dc41ec10bf2d2784aaf1602183027d8f8d23f1267c1a6';

      it('should return proper user', async () => {
        await service.signup(email, password);
        const user = await service.signin(email, password);        
        expect(user).toBeDefined();
      })
    })
    
    describe('and user provides invalid singin data', () => {
      const email = "unknown@test.com";
      const password = "randomePassword";

      it('throws BadRequestException if user provides unregistered email', async () => {
        try {
          await service.signin(email, password); 
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }        
      })

      it('throws BadThrowException if user provides invalid password', async () => {
        fakeUsersService.find = () => Promise.resolve([{id: 1, email, password } as User]);
        try {
          await service.signin(email, 'wrongPassword');
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException)
        }
      })
    })
    
  })
})
