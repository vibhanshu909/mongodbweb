import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { Theme } from '@/lib/store'

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export function ThemeToggle() {
  const { theme, setTheme } = useAppStore()

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const Icon = themeIcons[theme]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      title={`Current theme: ${themeLabels[theme]}. Click to cycle themes.`}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
