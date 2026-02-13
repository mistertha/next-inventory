import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './theme-toggle'

// Mock useTheme
const mockSetTheme = jest.fn()
jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}))

// Mock UI components
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => <button onClick={onClick}>{children}</button>,
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('renders correctly', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it('changes theme on click', () => {
    render(<ThemeToggle />)

    // Since we mocked DropdownMenu to always show content, we can just click the items

    // Click Dark
    fireEvent.click(screen.getByText(/Dark/i))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')

    // Click Light
    fireEvent.click(screen.getByText(/Light/i))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
