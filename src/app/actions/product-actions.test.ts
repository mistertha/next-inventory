import { getProducts } from './product-actions'
import { query } from '@/lib/db'

jest.mock('@/lib/db', () => ({
  query: jest.fn(),
  queryOne: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

describe('product-actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProducts', () => {
    it('should return all products when no search or category is provided', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', created_at: new Date() },
        { id: 2, name: 'Product 2', created_at: new Date() },
      ]
      ;(query as jest.Mock).mockResolvedValue(mockProducts)

      const result = await getProducts()

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM products'),
        expect.any(Array)
      )
      expect(result).toEqual(mockProducts)
    })

    it('should filter by search term', async () => {
      ;(query as jest.Mock).mockResolvedValue([])

      await getProducts('search')

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE name ILIKE $1'),
        expect.arrayContaining(['%search%'])
      )
    })

    it('should filter by category', async () => {
      ;(query as jest.Mock).mockResolvedValue([])

      await getProducts(undefined, 'Electronics')

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE category = $1'),
        expect.arrayContaining(['Electronics'])
      )
    })
  })
})
