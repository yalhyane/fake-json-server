import { Test, TestingModule } from '@nestjs/testing';
import { ParamParserService } from './param-parser.service';
import { SchemeType } from '../../generator/dto/generate-scheme-body.dto';

describe('ParamParserService', () => {
  let service: ParamParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParamParserService],
    }).compile();

    service = module.get<ParamParserService>(ParamParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parse', () => {
    it('should return schemaType object', () => {
      const s = 'fullname|length:2';
      const result = new SchemeType();
      result.setProperty('type', 'fullname');
      result.setProperty('length', ['2', '5']);

      expect(service.parse(s)).toBeInstanceOf(SchemeType);
    });

    it('should parse type and param right', () => {
      const s = 'fullname|length:2:5|isNotEmpty';
      const result = new SchemeType();
      result.setProperty('type', 'fullname');
      result.setProperty('length', ['2', '5']);
      result.setProperty('isNotEmpty', true);

      expect(service.parse(s)).toEqual(result);
    });

    it('should parse type, isArray and size correctly', () => {
      const s = 'person|isArray|size:10';
      const result = new SchemeType();
      result.setProperty('type', 'person');
      result.isArray = true;
      result.size = 10;

      expect(service.parse(s)).toEqual(result);
    });
  });

  describe('parseSchema', () => {
    it('should parse schema correctly', () => {
      const schema = {
        name: 'full_name',
        email: 'email',
        age: 'number|min:10|max:100',
        bio: 'text|charCount:100',
      };
      const result = {
        name: {
          type: 'full_name',
          properties: {}
        },
        email: {
          type: 'email',
          properties: {}
        },
        age: {
          type: 'number',
          properties: {
            min: '10',
            max: '100',
          },
        },
        bio: {
          type: 'text',
          properties: {
            charCount: '100',
          },
        },
      };

      expect(service.parseSchema(schema)).toEqual(result);
    });
  });
});
