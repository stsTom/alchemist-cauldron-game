import causticAcid from '../assets/ingredients/caustic-acid.svg';
import dragonTears from '../assets/ingredients/dragon-tears.svg';
import essenceOfTheVoid from '../assets/ingredients/essence-of-the-void.svg';
import fairyDust from '../assets/ingredients/fairy-dust.svg';
import frostLotus from '../assets/ingredients/frost-lotus.svg';
import mandrakeRoot from '../assets/ingredients/mandrake-root.svg';
import phoenixFeather from '../assets/ingredients/phoenix-feather.svg';
import toadSlime from '../assets/ingredients/toad-slime.svg';
import temperature from '../assets/stats/temperature.svg';
import density from '../assets/stats/density.svg';
import magicPower from '../assets/stats/magic-power.svg';
import heart from '../assets/controls/heart.svg';
import heartEmpty from '../assets/controls/heart-empty.svg';
import clock from '../assets/controls/clock.svg';
import gear from '../assets/controls/gear.svg';
import help from '../assets/controls/help.svg';
import pause from '../assets/controls/pause.svg';
import type { IMeasurements } from '../shared/types';

export const CONTROL_ICONS = { heart, heartEmpty, clock, gear, help, pause };

export function setIconButton(button: HTMLButtonElement, src: string, caption: string) {
  const icon = document.createElement('img');
  icon.src = src;
  icon.alt = '';
  const label = document.createElement('span');
  label.textContent = caption;
  button.classList.add('icon-button');
  button.replaceChildren(icon, label);
}

export const STAT_ICONS: Record<keyof IMeasurements, string> = {
  temperature,
  density,
  magicPower,
};

export const INGREDIENT_ICONS: Record<string, string> = {
  'caustic-acid': causticAcid,
  'dragon-tears': dragonTears,
  'essence-of-the-void': essenceOfTheVoid,
  'fairy-dust': fairyDust,
  'frost-lotus': frostLotus,
  'mandrake-root': mandrakeRoot,
  'phoenix-feather': phoenixFeather,
  'toad-slime': toadSlime,
};
