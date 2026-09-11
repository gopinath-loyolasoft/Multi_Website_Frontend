import { useLayoutContext } from '@/context/useLayoutContext'

import compactImg from '@/assets/images/layouts/sidenav-size-compact.png'
import condensedImg from '@/assets/images/layouts/sidenav-size-condensed.png'
import defaultImg from '@/assets/images/layouts/sidenav-size-default.png'
import offcanvasImg from '@/assets/images/layouts/sidenav-size-offcanvas.png'
import onHoverActiveImg from '@/assets/images/layouts/sidenav-size-on-hover-active.png'
import onHoverImg from '@/assets/images/layouts/sidenav-size-on-hover.png'

type SidenavOption = {
  value: string
  label: string
  image: string
}

const sidenavSizeOptions: SidenavOption[] = [
  { value: 'default', label: 'Default', image: defaultImg },
  { value: 'compact', label: 'Compact', image: compactImg },
  { value: 'condensed', label: 'Condensed', image: condensedImg },
  { value: 'on-hover', label: 'On Hover', image: onHoverImg },
  { value: 'on-hover-active', label: 'On Hover Active', image: onHoverActiveImg },
  { value: 'offcanvas', label: 'Offcanvas', image: offcanvasImg },
]

const SidenavSize = () => {
  const { updateSettings, sidenavSize } = useLayoutContext()

  const handleSidenavSizeChange = (value: string) => {
    updateSettings({ sidenavSize: value })
  }

  return (
    <div className="p-5">
      <h5 className="text-md mb-4 font-bold text-slate-800 dark:text-slate-100">Sidenav View</h5>
      <div className="grid grid-cols-3 gap-3">
        {sidenavSizeOptions.map((option) => {
          const isChecked = sidenavSize === option.value
          return (
            <div className="card-radio relative cursor-pointer" key={option.value}>
              <input
                className="hidden"
                type="radio"
                name="data-sidenav-size"
                id={`layout-sidenav-size-${option.value}`}
                checked={isChecked}
                onChange={() => handleSidenavSizeChange(option.value)}
              />
              <label
                className={`form-label block rounded-xl border-2 p-1 transition-all ${
                  isChecked
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                htmlFor={`layout-sidenav-size-${option.value}`}
              >
                <img src={option.image} alt={option.label} className="w-full h-auto rounded-lg" />
              </label>
              <h5 className={`text-xs mt-1.5 text-center font-medium ${isChecked ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                {option.label}
              </h5>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SidenavSize

