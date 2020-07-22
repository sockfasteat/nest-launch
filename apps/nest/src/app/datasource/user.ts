import * as isEmail from 'isemail';
import { getConnection, getRepository, Repository } from 'typeorm';
import { DataSource } from 'apollo-datasource';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TRIP_REPOSITORY, USER_REPOSITORY } from '../common/constants';
import { TripEntity, UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from '../user/models/user.dto';

@Injectable()
class UserAPI extends DataSource {
  private context;
  private usersRepository: Repository<UserEntity>;
  private tripRepository: Repository<TripEntity>;
  // @Inject(USER_REPOSITORY)
  // @InjectRepository(UserEntity)
  // @Inject(TRIP_REPOSITORY)
  // @InjectRepository(TripEntity)
  constructor(
    // @Inject(USER_REPOSITORY)
    // private usersRepository: Repository<UserEntity>,
    // // @Inject(TRIP_REPOSITORY)
    // private tripRepository: Repository<TripEntity>,
    ) {
    super();
    this.getConnection();
    // this.usersRepository = getRepository(UserEntity);
    // this.tripRepository = getRepository(TripEntity);
  }

  async getConnection() {
    const connection = await getConnection();
    this.usersRepository = connection.getRepository(UserEntity);
    this.tripRepository = connection.getRepository(TripEntity);
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async read(userName: string) {
    const user = await this.usersRepository.findOne({
      where: { userName },
    });
    return user;
  }

  async signIn(email: string) {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async signUp(data: SignUpUserDto) {
    const { userName, email } = data;

    let user = await this.usersRepository.findOne({
      where: [{ userName }, { email }],
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    user = await this.usersRepository.create({ ...data });
    await this.usersRepository.save(user);

    return user;
  }

  async findUser({ email: emailArg }: { email?: string }) {
    const email =
      this.context && this.context.me ? this.context.me.email : emailArg;
    if (!email || !isEmail.validate(email)) {
      return null;
    }
    return await this.usersRepository.findOne({ email });
  }

  async bookTrips({ launchIds }) {
    const userId = this.context.me.id;
    if (!userId) {
      return;
    }

    const results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {
    const userId: string = this.context.me.id;
    const user: UserEntity = this.context.me;

    const trip = await this.tripRepository.findOne({
      where: { launchId: launchId, user: { id: userId } }
    });

    if (trip) {
      return trip;
    }

    const newTrip = new TripEntity();
    newTrip.launchId = launchId;
    const result = await this.tripRepository.create({ ...newTrip, user });

    return await this.tripRepository.save(result);
  }

  async cancelTrip({ launchId }) {
    const userId = this.context.me.id;
    // TODO: ????
    const trip = await this.tripRepository.findOne({
      where: { launchId: launchId, userId },
      relations: ['user']
    });

    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }

    if (trip.user.id !== userId) {
      throw new HttpException('Action not allowed', HttpStatus.FORBIDDEN);
    }

    return await this.tripRepository.remove(trip);
  }

  async getLaunchIdsByUser() {
    const userId = this.context.me.id;
    // TODO: ????
    const found = await this.tripRepository.find({
      where: { userId },
      relations: ['user'],
    });

    return found && found.length
      ? found.map(l => l.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.me) {
      return false
    }
    const userId = this.context.me.id;
    const found = await this.tripRepository.find({
      where: { launchId: launchId, userId },
      relations: ['user']
    });
    return found && found.length > 0;
  }
}

export default UserAPI;
