/**
 * 设置
 */

export type Setting = {
  projectKey: string
  submitPromptImg: string
  submitPromptText: string
  submitJumpUrl: string
  publicResult: boolean
  wxWrite: boolean
  wxWriteOnce: boolean
  everyoneWriteOnce: boolean
  everyoneDayWriteOnce: boolean
  writeOncePromptText: string
  newWriteNotifyEmail: string
  newWriteNotifyWx: string
  recordWxUser: boolean
  timedCollectionBeginTime: string
  timedCollectionEndTime: string
  timedNotEnabledPromptText: string
  timedDeactivatePromptText: string
  timedQuantitativeQuantity: string | null
  timedEndPromptText: string
  shareImg: string
  shareTitle: string
  shareDesc: string
}
