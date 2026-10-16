import axios from 'axios';

const USERS_API_URL = 'http://localhost:5001/users';

export async function mockLogin({ email, password }) {
  try {
    const response = await axios.get(USERS_API_URL);
    const users = response.data;
    const foundUser = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    );
    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }
    return {
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      },
      accessToken: 'mock-jwt-access-token-' + foundUser.id
    };
  } catch (error) {
    if (error.response) {
      throw new Error('Unable to connect to authentication server.');
    }
    throw error;
  }
}
export async function mockRegister({ name, email, password }) {
  try {
    const response = await axios.get(USERS_API_URL);
    const users = response.data;
    const existingUser = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
      throw new Error('This email is already registered. Please login instead.');
    }
    const newUser = {
      name,
      email,
      password,
      role: 'user'
    };
    const postResponse = await axios.post(USERS_API_URL, newUser);
    const createdUser = postResponse.data;
    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role
      },
      accessToken: 'mock-jwt-access-token-' + createdUser.id
    };
  } catch (error) {
    if (error.message.includes('already registered')) {
      throw error;
    }
    throw new Error('Registration failed. Please try again.');
  }
}