/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CrService } from './chngerequest.service';

describe('ChngerequestService', () => {
  let service: CrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrService],
    }).compile();

    service = module.get<CrService>(CrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
