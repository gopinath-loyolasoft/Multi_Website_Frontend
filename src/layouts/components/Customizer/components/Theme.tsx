import { useLayoutContext } from '@/context/useLayoutContext'
import { useThemeMode, ThemeMode } from '@/contexts/ThemeModeContext'
import { toTitleCase } from '@/utils/helpers'
import type { CustomizationOptionType } from '../index'

import darkImg from '@/assets/images/layouts/theme-dark.png'
import lightImg from '@/assets/images/layouts/theme-light.png'
import systemImg from '@/assets/images/layouts/theme-system.png'

const themeOptions: CustomizationOptionType[] = [
  { value: 'light', image: lightImg },
  { value: 'dark', image: darkImg },
  { value: 'system', image: systemImg },
]

const Theme = () => {
  const { updateSettings } = useLayoutContext()
  const { themeMode, setThemeMode } = useThemeMode()

  const handleThemeChange = (value: string) => {
    updateSettings({ theme: value })
    setThemeMode(value as ThemeMode)
  }

  return (
    <div className="p-5">
      <h5 className="text-md mb-5 font-bold text-slate-900 dark:text-white">Theme Mode</h5>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-base">
        {themeOptions.map((item, idx) => (
          <div className="card-radio" key={idx}>
            <input
              className="hidden"
              type="radio"
              name="data-theme"
              id={`layout-color-${item.value}`}
              checked={themeMode === item.value}
              onChange={() => handleThemeChange(item.value)}
            />
            <label className="form-label cursor-pointer" htmlFor={`layout-color-${item.value}`}>
              <img
                src={item.image}
                alt="layout img"
                className={`flex size-full rounded-md border-2 transition ${
                  themeMode === item.value
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </label>
            <h5 className="text-md text-default-600 dark:text-slate-300 mt-2.5 text-center font-medium">
              {toTitleCase(item.value)}
            </h5>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Theme
