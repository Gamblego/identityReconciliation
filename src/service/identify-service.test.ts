import { identifyContact } from './identify-service';
import { APIRequest } from '../interface/common';

const mockGetAllByEmailOrPhoneNumber = jest.fn()
const mockCreate = jest.fn()

jest.mock('../repository/contact', () => {
  return {
    Contact: jest.fn().mockImplementation(() => {
      return {
        getAllByEmailOrPhoneNumber: mockGetAllByEmailOrPhoneNumber,
        create: mockCreate,
        updateAllByLinkedId: jest.fn(),
      };
    }),
  };
});

describe('identifyContact', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('case 1: no contacts present', async () => {
    mockGetAllByEmailOrPhoneNumber.mockResolvedValueOnce([]);
    mockCreate.mockResolvedValueOnce({
      id: 1,
      linkPrecedence: "primary",
      email:  'new@email.com',
      phoneNumber: '9876543210',
      createdAt: new Date(),
      updatedAt: new Date(),
      linkedId: null
    })
    const req: APIRequest = {
      email: 'new@email.com',
      phoneNumber: '9876543210',
    };

    const result = await identifyContact(req);

    expect(result).toEqual({
      contact: {
        emails: ["new@email.com"],
        phoneNumbers: ["9876543210"],
        "primaryContactId": 1,
        "secondaryContactIds": []
      }
    });
  })
  test('case 2: 1 primary id existing', async () => {
    mockGetAllByEmailOrPhoneNumber.mockResolvedValueOnce([
      { id: 1, linkPrecedence: 'primary', email: 'existing@email.com', phoneNumber: '1234567890', createdAt: new Date(), updatedAt: new Date(), linkedId: null }
    ]);
    mockCreate.mockResolvedValueOnce({
      id: 2,
      linkPrecedence: "secondary",
      email:  'existing@email.com',
      phoneNumber: '0987654321',
      createdAt: new Date(),
      updatedAt: new Date(),
      linkedId: null
    })
    const req: APIRequest = {
      email: 'existing@email.com',
      phoneNumber: '0987654321',
    };

    const result = await identifyContact(req);

    expect(result).toEqual({
      contact: {
        emails: ["existing@email.com"],
        phoneNumbers: ["1234567890", "0987654321"],
        "primaryContactId": 1,
        "secondaryContactIds": [2]
      }
    });
  });

  test('case 3: 1 secondary id existing', async () => {
    mockGetAllByEmailOrPhoneNumber.mockResolvedValueOnce([
      { id: 1, linkPrecedence: 'primary', email: 'existing@email.com', phoneNumber: '0987654321', createdAt: new Date(), updatedAt: new Date(), linkedId: null },
      { id: 2, linkPrecedence: 'secondary', email: 'existing2@email.com', phoneNumber: '1234567890', createdAt: new Date(), updatedAt: new Date(), linkedId: null },
    ]);
    mockCreate.mockResolvedValueOnce({
      id: 3,
      linkPrecedence: "secondary",
      email:  'new@email.com',
      phoneNumber: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      linkedId: null
    })
    const req: APIRequest = {
      email: 'new@email.com',
      phoneNumber: '1234567890',
    };

    const result = await identifyContact(req);

    expect(result).toEqual({
      contact: {
        emails: ["existing@email.com", "existing2@email.com", "new@email.com"],
        phoneNumbers: ["0987654321", "1234567890"],
        "primaryContactId": 1,
        "secondaryContactIds": [2, 3]
      }
    });
  });

  test('case 4: 1 secondary and primary id existing', async () => {
    mockGetAllByEmailOrPhoneNumber.mockResolvedValueOnce([
      { id: 1, linkPrecedence: 'primary', email: 'existing@email.com', phoneNumber: '1234567890', createdAt: new Date(), updatedAt: new Date(), linkedId: null },
      { id: 2, linkPrecedence: 'secondary', email: 'existing2@email.com', phoneNumber: '0987654321', createdAt: new Date(), updatedAt: new Date(), linkedId: null },
    ]);
    const req: APIRequest = {
      email: 'existing2@email.com',
      phoneNumber: '1234567890',
    };

    const result = await identifyContact(req);

    expect(result).toEqual({
      contact: {
        emails: ["existing@email.com", "existing2@email.com"],
        phoneNumbers: ["1234567890", "0987654321"],
        "primaryContactId": 1,
        "secondaryContactIds": [2]
      }
    });
  });

  test('case 5: 2 primary ids existing', async () => {
    mockGetAllByEmailOrPhoneNumber.mockResolvedValueOnce([
      { id: 1, linkPrecedence: 'primary', email: 'existing@email.com', phoneNumber: '1234567890', createdAt: new Date(), updatedAt: new Date(), linkedId: null },
      { id: 2, linkPrecedence: 'primary', email: 'existing2@email.com', phoneNumber: '0987654321', createdAt: new Date(), updatedAt: new Date(), linkedId: null },
    ]);
    const req: APIRequest = {
      email: 'new@email.com',
      phoneNumber: '0987654321',
    };

    const result = await identifyContact(req);

    expect(result).toEqual({
      contact: {
        emails: ["existing@email.com", "existing2@email.com"],
        phoneNumbers: ["1234567890", "0987654321"],
        "primaryContactId": 1,
        "secondaryContactIds": [2]
      }
    });
  });
});
