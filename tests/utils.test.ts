import { convertContactToResponse, validatePhoneNumber, validateEmail } from "../src/helper/utils";
import { APIResponse, ContactType } from "../src/interface/common";

// Unit test for convertContactToResponse function
describe("convertContactToResponse", () => {
  it("should return the correct API response", () => {
    const contacts: ContactType[] = [
      { id: 1, email: "email1@example.com", phoneNumber: "1234567890" },
      { id: 2, email: "email2@example.com", phoneNumber: "1234567890" },
    ];
    const primaryId = 1;

    const expectedResponse: APIResponse = {
      contact: {
        primaryContactId: 1,
        emails: ["email1@example.com", "email2@example.com"],
        phoneNumbers: ["1234567890"],
        secondaryContactIds: [2],
      },
    };

    expect(convertContactToResponse(contacts, primaryId)).toEqual(expectedResponse);
  });
});

// Unit tests for validatePhoneNumber function
describe("validatePhoneNumber", () => {
  it("should return true for a valid phone number", () => {
    const phoneNumber = "1234567890";
    expect(validatePhoneNumber(phoneNumber)).toBe(true);
  });

  it("should return true for a phone number containing non-digit characters", () => {
    const phoneNumber = "123-456-7890";
    expect(validatePhoneNumber(phoneNumber)).toBe(true);
  });

  it("should return false for a phone number with an invalid length", () => {
    const phoneNumber = "123456789";
    expect(validatePhoneNumber(phoneNumber)).toBe(false);
  });
});

// Unit tests for validateEmail function
describe("validateEmail", () => {
  it("should return true for a valid email address", () => {
    const email = "email@example.com";
    expect(validateEmail(email)).toBe(true);
  });

  it("should return false for an email address without an '@' symbol", () => {
    const email = "invalid.email.com";
    expect(validateEmail(email)).toBe(false);
  });

  it("should return false for an email address without a valid domain", () => {
    const email = "email@invalid";
    expect(validateEmail(email)).toBe(false);
  });
});