import { Epml } from '../../epml.js';
import { cropAddress } from './cropAddress.js';

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

export const getUserNameFromAddress = async (address) => {
  try {
    const getNames = await parentEpml.request("apiCall", {
      type: "api",
      url: `/names/address/${address}`,
    });

    if (Array.isArray(getNames) && getNames.length > 0 ) {
        return getNames[0].name;
    } else {
        return address;
    }
  } catch (error) {
      console.error(error);
  }
}