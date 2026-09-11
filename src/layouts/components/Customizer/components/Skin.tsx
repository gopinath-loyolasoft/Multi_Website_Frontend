import { useLayoutContext } from '@/context/useLayoutContext'
import { toTitleCase } from '@/utils/helpers'
import type { CustomizationOptionType } from '../index'

import auroraImg from '@/assets/images/layouts/skin-aurora.png'

import crystalImg from '@/assets/images/layouts/skin-crystal.png'
import defaultImg from '@/assets/images/layouts/skin-default.png'

import elegantImg from '@/assets/images/layouts/skin-elegant.png'
import flatImg from '@/assets/images/layouts/skin-flat.png'
import galaxyImg from '@/assets/images/layouts/skin-galaxy.png'

import luxeImg from '@/assets/images/layouts/skin-luxe.png'
import materialImg from '@/assets/images/layouts/skin-material.png'
import matrixImg from '@/assets/images/layouts/skin-matrix.png'

import minimalImg from '@/assets/images/layouts/skin-minimal.png'
import modernImg from '@/assets/images/layouts/skin-modern.png'
import monoImg from '@/assets/images/layouts/skin-mono.png'
import neoImg from '@/assets/images/layouts/skin-neo.png'
import neonImg from '@/assets/images/layouts/skin-neon.png'
import novaImg from '@/assets/images/layouts/skin-nova.png'
import orbitImg from '@/assets/images/layouts/skin-orbit.png'
import pixelImg from '@/assets/images/layouts/skin-pixel.png'
import prismImg from '@/assets/images/layouts/skin-prism.png'
import retroImg from '@/assets/images/layouts/skin-retro.png'
import saasImg from '@/assets/images/layouts/skin-saas.png'
import silverImg from '@/assets/images/layouts/skin-silver.png'

import softImg from '@/assets/images/layouts/skin-soft.png'

import vividImg from '@/assets/images/layouts/skin-vivid.png'
import xenonImg from '@/assets/images/layouts/skin-xenon.png'
import zenImg from '@/assets/images/layouts/skin-zen.png'

const skinOptions: CustomizationOptionType[] = [
  { value: 'default', image: defaultImg },
  { value: 'minimal', image: minimalImg },
  { value: 'modern', image: modernImg },
  { value: 'material', image: materialImg },
  { value: 'saas', image: saasImg },
  { value: 'flat', image: flatImg },
  { value: 'galaxy', image: galaxyImg },
  { value: 'luxe', image: luxeImg },
  { value: 'retro', image: retroImg },
  { value: 'neon', image: neonImg },
  { value: 'pixel', image: pixelImg },
  { value: 'soft', image: softImg },
  { value: 'mono', image: monoImg },
  { value: 'prism', image: prismImg },
  { value: 'nova', image: novaImg },
  { value: 'zen', image: zenImg },
  { value: 'elegant', image: elegantImg },
  { value: 'vivid', image: vividImg },
  { value: 'aurora', image: auroraImg },
  { value: 'crystal', image: crystalImg },
  { value: 'matrix', image: matrixImg },
  { value: 'orbit', image: orbitImg },
  { value: 'neo', image: neoImg },
  { value: 'silver', image: silverImg },
  { value: 'xenon', image: xenonImg },
]

const Skin = () => {
  const { updateSettings, skin } = useLayoutContext()

  const handleSkinChange = (value: string) => {
    updateSettings({ skin: value })
  }

  return (
    <div className="p-6">
      <h5 className="text-md mb-base font-bold">Select Theme</h5>
      <div className="grid grid-cols-2 gap-3">
        {skinOptions.map((item) => (
          <div className="card-radio" key={item.value}>
            <input className="hidden" type="radio" name="data-skin" id={`demo-skin-${item.value}`} checked={skin === item.value} onChange={() => handleSkinChange(item.value)} />
            <label className="form-label" htmlFor={`demo-skin-${item.value}`}>
              <img src={item.image} alt="layout img" className="flex size-full rounded-md" />
            </label>
            <h5 className="text-md text-default-600 mt-2.5 text-center">{toTitleCase(item.value)}</h5>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skin
