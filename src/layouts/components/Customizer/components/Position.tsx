import { useLayoutContext } from '@/context/useLayoutContext'

const Position = () => {
  const { updateSettings, position } = useLayoutContext()

  const handlePositionChange = (value: string) => {
    updateSettings({ position: value })
  }

  return (
    <div className="p-6" id="sidenav-user">
      <div className="flex items-center justify-between">
        <h5 className="font-bold">Layout Position</h5>
        <div className="flex gap-1">
          <div id="position-fixed">
            <input type="radio" className="peer hidden" name="data-layout-position" id="layout-position-fixed" checked={position === 'fixed'} onChange={() => handlePositionChange('fixed')} />
            <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition" htmlFor="layout-position-fixed">
              Fixed
            </label>
          </div>
          <div id="position-scrollable">
            <input type="radio" className="peer hidden" name="data-layout-position" id="layout-position-scrollable" checked={position === 'scrollable'} onChange={() => handlePositionChange('scrollable')} />
            <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition" htmlFor="layout-position-scrollable">
              Scrollable
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Position
