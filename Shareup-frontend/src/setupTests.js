// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock axios to avoid ESM transform issues in Jest and to keep tests isolated
// Provides basic stubs for common methods and interceptors used in services
jest.mock('axios', () => {
	const mockResponse = { data: { data: [] } };
	const fn = jest.fn(() => Promise.resolve(mockResponse));
	fn.get = jest.fn(() => Promise.resolve(mockResponse));
	fn.post = jest.fn(() => Promise.resolve(mockResponse));
	fn.put = jest.fn(() => Promise.resolve(mockResponse));
	fn.delete = jest.fn(() => Promise.resolve(mockResponse));
	fn.interceptors = {
		request: { use: jest.fn() },
		response: { use: jest.fn() },
	};
	fn.create = jest.fn(() => fn);
	return fn;
});

// Mock problematic UI libs for Jest DOM environment
jest.mock('react-owl-carousel', () => () => null);
jest.mock('yet-another-react-lightbox', () => () => null);
// Mock its stylesheet import explicitly
jest.mock('yet-another-react-lightbox/styles.css', () => ({}), { virtual: true });
// Mock Giphy component to avoid side effects and axios calls during tests
jest.mock('./components/Giphy', () => () => null);
