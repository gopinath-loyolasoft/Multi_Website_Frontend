import Icon from '@/components/wrappers/Icon'
import { SimpleBar } from '@/components/wrappers/SimpleBar'
import { useLayoutContext } from '@/context/useLayoutContext'
import Dir from './components/Dir'
import Orientation from './components/Orientation'
import Position from './components/Position'
import SidenavColor from './components/SidenavColor'
import SidenavSize from './components/SidenavSize'
import SidenavUser from './components/SidenavUser'
import Skin from './components/Skin'
import Theme from './components/Theme'
import TopBarColor from './components/TopbarColor'
import Width from './components/Width'

export type CustomizationOptionType = {
  value: string
  image: string
}

export const Customizer = () => {
  const { reset, isCustomizerOpen, toggleCustomizer } = useLayoutContext()

  return (
    <>
      {/* Slide-in Customizer Drawer (No dark/blur backdrop so left content remains clearly visible) */}

      {/* Slide-in Customizer Drawer */}
      <div
        id="theme-customization"
        className={`fixed inset-y-0 end-0 bottom-0 z-50 w-full max-w-[400px] flex flex-col overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${
          isCustomizerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="bg-primary text-white p-6 flex items-start justify-between gap-3 shadow-sm shrink-0">
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white">Admin Customizer</h5>
            <p className="text-xs text-white/80 mt-1 font-medium">Easily configure layout, styles, and preferences for your admin interface.</p>
          </div>
          <button 
            type="button" 
            onClick={toggleCustomizer} 
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition shrink-0"
            title="Close Customizer"
          >
            <Icon icon="x" className="w-5 h-5" />
          </button>
        </div>
        <SimpleBar className="h-full grow overflow-y-auto">
          <div className="divide-default-300 divide-y divide-dashed">
            <Skin />

            <Dir />

            <SidenavSize />

            <Theme />

            <SidenavColor />

            <TopBarColor />

            <Width />

            <Orientation />

            <Position />

            <SidenavUser />
          </div>
        </SimpleBar>
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 shrink-0">
          <button 
            type="button" 
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition" 
            onClick={reset}
          >
            <Icon icon="refresh" className="w-4 h-4" /> Reset Settings
          </button>
        </div>
      </div>
    </>
  )
}

export default Customizer
