import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {},
  auth: {},
  updateBlog: jest.fn(),
  createBlog: jest.fn(),
  getBlog: jest.fn(),
  deleteBlog: jest.fn(),
}))

// Mock Cloudinary
jest.mock('@/utils/cloudinary', () => ({
  uploadImage: jest.fn(),
  getOptimizedImageUrl: jest.fn(),
}))

// Mock window.prompt
global.prompt = jest.fn()

// Mock window.confirm
global.confirm = jest.fn(() => true)

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}