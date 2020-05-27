import * as React from 'react'
import { TFunctionResult } from 'i18next'
import { ColorResult } from 'react-color'
import { ReactSVG } from 'react-svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { memo, createRef, useEffect, useCallback, useContext, useRef, RefObject } from 'react'
import { TextCustomization, ImageCustomization } from '@client/ts/shared/validators'
import { Translation, useTranslation } from 'react-i18next'
import Accordion from '@client/components/Accordion/Accordion'
import TextareaExtended from '@client/components/TextareaExpended/TextareaExtended'
import ColorPicker from '@client/components/ColorPicker/ColorPicker'
import InputRangeSlider from '@client/components/InputRangeSlider/InputRangeSlider'
import TextBox from '@client/ts/shared/models/TextBox'
import { fontSizeConfig, boxShadowConfig } from '@client/ts/shared/config-editor'
import { EditorContext, EditorState, EditorInt, EditorDispatch } from '@client/store/EditorContext'
import {
  CUSTOM_TEXT,
  ADD_ITEM,
  REMOVE_ITEM,
  DUPLICATE_ITEM,
  SET_ITEM_ID_SELECTED,
  CUSTOM_IMAGE
} from '@client/store/reducer/constants'
import { toHistoryType } from '@client/utils/helpers'
import { FONTS_FAMILY, ALIGN_VERTICAL, TEXT_ALIGN } from '@shared/config'
import ImageBox from '@client/ts/shared/models/ImageBox'
import { TEXT_ADDED, IMAGE_REMOVED, TEXT_REMOVED, IMAGE_ADDED } from '@client/ts/shared/constants'
import { endWithExt, toBase64 } from '@client/utils/index'
import { useWindowWidth } from '@client/ts/shared/hooks'
import './customization.scss'

const map = new Map<string, React.RefObject<unknown>>()

const setRef = (key: string): React.RefObject<unknown> => {
  const ref = createRef()
  map.set(key, ref)
  return ref
}

const getRef = (key: string): React.RefObject<unknown> | null => {
  return map.get(key)
}

function Customization(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { isMinLgSize } = useWindowWidth()
  const uploadInput: RefObject<HTMLInputElement> = useRef(null)
  const [{ itemIdSelected, texts, images, memeSelected, saveToEditor }, dispatchEditor]: [EditorInt, EditorDispatch] = useContext(
    EditorContext
  )

  const handleEditText = ({ textId, type, value }: TextCustomization): void => {
    const text: any = { ...texts.find((t: TextBox) => t.id === textId) }
    if (type in text) text[type] = value
    saveToEditor({ type: CUSTOM_TEXT, text, historyType: toHistoryType(type) })
  }

  const handleEditImage = ({ imageId, type, value }: ImageCustomization): void => {
    const image: any = { ...images.find((i: ImageBox) => i.id === imageId) }
    if (type in image) image[type] = value
    saveToEditor({ type: CUSTOM_IMAGE, image, historyType: toHistoryType(type) })
  }

  const addItem = useCallback((): void => {
    saveToEditor({ type: ADD_ITEM, itemType: 'text', historyType: TEXT_ADDED })
  }, [saveToEditor])

  const removeItem = useCallback(
    (itemType: 'text' | 'image', itemId: TextBox['id'] | ImageBox['id']): void => {
      saveToEditor({ type: REMOVE_ITEM, itemId, itemType, historyType: itemType === 'image' ? IMAGE_REMOVED : TEXT_REMOVED })
    },
    [saveToEditor]
  )

  const duplicateItem = useCallback(
    (itemType: 'text' | 'image', itemId: TextBox['id'] | ImageBox['id']): void => {
      saveToEditor({ type: DUPLICATE_ITEM, itemId, itemType })
    },
    [saveToEditor]
  )

  const selectItem = useCallback(
    (itemId: TextBox['id'] | ImageBox['id'], opened: boolean): void => {
      dispatchEditor({
        type: SET_ITEM_ID_SELECTED,
        itemIdSelected: opened ? itemId : null
      })
    },
    [dispatchEditor]
  )

  const handleKeyPress = useCallback((): void => {
    const textarea = getRef(`textarea-${itemIdSelected}`) as React.RefObject<HTMLTextAreaElement>
    textarea.current.focus()
  }, [itemIdSelected])

  useEffect(() => {
    if (itemIdSelected) {
      window.addEventListener('keypress', handleKeyPress)
    }
    return (): void => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [handleKeyPress, itemIdSelected])

  const handleUploadImagebox = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const files = e.currentTarget.files

      if (files.length > 1 || !endWithExt(['.jpg', '.png', 'jpeg'], files[0].name)) {
        uploadInput.current.value = ''
        return
      }

      const file = files[0]

      try {
        const img = await toBase64(file)
        img.name = file.name

        saveToEditor({
          type: ADD_ITEM,
          historyType: IMAGE_ADDED,
          itemType: 'image',
          img
        })
      } catch (error) {
        console.error(error)
      } finally {
        uploadInput.current.value = ''
      }
    },
    [saveToEditor]
  )

  return (
    <div className="customization-not-empty">
      <h2>
        {t('studio.customization')} <br /> <span className="meme-name">{memeSelected.name(i18n.language)}</span>
      </h2>
      {texts.map(
        (
          { value, id, color, fontSize, alignVertical, textAlign, isUppercase, fontFamily, boxShadow },
          textIndex
        ): React.ReactNode => (
          <Accordion
            id={id}
            type="text"
            defaultOpened={id === itemIdSelected}
            title={value.trim() || `${t('studio.text')} #${textIndex + 1}`}
            key={id}
            onToggle={selectItem}
            onDuplicate={duplicateItem}
            onRemove={removeItem}
          >
            <div className="customization-textbox-section">
              <div className="field-customization">
                <TextareaExtended
                  rows={1}
                  name="value"
                  ref={setRef(`textarea-${id}`)}
                  placeholder={`${t('studio.text')} #${textIndex + 1}`}
                  value={value}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void =>
                    handleEditText({
                      textId: id,
                      type: 'value',
                      value: event.target.value
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="font-size">{t('studio.maxFontSize')}</label>
                <InputRangeSlider
                  id="font-size"
                  max={fontSizeConfig.max}
                  width={98}
                  min={fontSizeConfig.min}
                  step={1}
                  value={fontSize}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEditText({
                      textId: id,
                      type: 'fontSize',
                      value: parseInt(event.target.value)
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="box-shadow">{t('studio.boxShadow')}</label>
                <InputRangeSlider
                  id="box-shadow"
                  max={boxShadowConfig.max}
                  width={98}
                  min={boxShadowConfig.min}
                  step={1}
                  value={boxShadow}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEditText({
                      textId: id,
                      type: 'boxShadow',
                      value: parseInt(event.target.value)
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <label htmlFor="color">{t('studio.color')}</label>
                <ColorPicker
                  color={color}
                  setColor={({ hex }: ColorResult): void =>
                    handleEditText({
                      textId: id,
                      type: 'color',
                      value: hex
                    })
                  }
                />
              </div>
              <div className="field-customization">
                <span>{t('studio.fontFamily')}</span>
                <select
                  value={fontFamily}
                  name="font-family"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEditText({
                      textId: id,
                      type: 'fontFamily',
                      value: event.target.value
                    })
                  }
                >
                  {FONTS_FAMILY.map((font: string) => (
                    <option value={font} key={font.replace(/ /g, '+')}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.alignVertical')}</span>
                <select
                  value={alignVertical}
                  name="align-vertical"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEditText({
                      textId: id,
                      type: 'alignVertical',
                      value: event.target.value
                    })
                  }
                >
                  {ALIGN_VERTICAL.map(value => (
                    <option key={value} value={value}>
                      {t(`studio.${value}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.textAlign')}</span>
                <select
                  value={textAlign}
                  name="text-align"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
                    handleEditText({
                      textId: id,
                      type: 'textAlign',
                      value: event.target.value
                    })
                  }
                >
                  {TEXT_ALIGN.map(value => (
                    <option key={value} value={value}>
                      {t(`studio.${value}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-customization">
                <span>{t('studio.textUppercase')}</span>
                <input
                  type="checkbox"
                  name="uppercase"
                  checked={isUppercase}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEditText({
                      textId: id,
                      type: 'isUppercase',
                      value: event.target.checked
                    })
                  }
                />
              </div>
            </div>
          </Accordion>
        )
      )}
      {images.map(
        (image: ImageBox): React.ReactNode => (
          <Accordion
            id={image.id}
            type="image"
            onDuplicate={duplicateItem}
            onRemove={removeItem}
            defaultOpened={image.id === itemIdSelected}
            onToggle={selectItem}
            title={image.name}
            key={image.id}
          >
            <div className="customization-textbox-section">
              <div className="field-customization">
                <span>{t('studio.keepRatio')}</span>
                <input
                  type="checkbox"
                  name="keep-ratio"
                  checked={image.keepRatio}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                    handleEditImage({
                      imageId: image.id,
                      type: 'keepRatio',
                      value: event.target.checked
                    })
                  }
                />
              </div>
            </div>
          </Accordion>
        )
      )}
      <span role="button" className="add-item-button" onClick={addItem}>
        <FontAwesomeIcon className="icon-plus" icon={['fas', 'plus']} />
        <span>{t('studio.addText')}</span>
      </span>
      {isMinLgSize && (
        <label htmlFor="upload-imagebox" className="add-item-button" role="button">
          <FontAwesomeIcon className="icon-plus" icon={['fas', 'plus']} />
          <span>{t('studio.addImage')}</span>
          <input
            ref={uploadInput}
            onChange={handleUploadImagebox}
            type="file"
            accept="image/png, image/jpeg"
            id="upload-imagebox"
          />
        </label>
      )}
    </div>
  )
}

export default memo(
  (): JSX.Element => {
    return (
      <EditorContext.Consumer>
        {([{ memeSelected }]: [EditorState]): JSX.Element => (
          <div className="customization">
            {memeSelected ? (
              <Customization />
            ) : (
              <div className="customization-empty">
                <ReactSVG src="/images/sad.svg" wrapper="span" className="wrapper-sad-svg" />
                <Translation>{(t): TFunctionResult => <h3>{t('studio.noMemeSelected')}</h3>}</Translation>
              </div>
            )}
          </div>
        )}
      </EditorContext.Consumer>
    )
  }
)
