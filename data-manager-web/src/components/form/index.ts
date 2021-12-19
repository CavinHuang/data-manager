import { App } from 'vue'
import ImageSelect from './ImageSelect/index.vue'
import DescText from './DescText/index.vue'
import SignPad  from './SignPad/index.vue'
import ProvinceCity from './ProvinceCity/index.vue'
import PhoneVerification from './PhoneVerification/index.vue'
import PersonalInformation from './PersonalInformation'
export default {
  install: (app: App) => {
    app.component(SignPad.name, SignPad)
    app.component(ImageSelect.name, ImageSelect)
    app.component(DescText.name, DescText)
    app.component(ProvinceCity.name, ProvinceCity)
    app.component(PhoneVerification.name, PhoneVerification)
    app.component(PersonalInformation.name, PersonalInformation)
  }
}
