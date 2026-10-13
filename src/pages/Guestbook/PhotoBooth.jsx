import { useCallback, useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Camera, Upload } from 'lucide-react'
import { toBlob } from 'html-to-image'
import { createGuestbookEntry, uploadGuestbookImage, PASTEL_COLORS } from '../../lib/supabase02.js'
import '../Guestbook/Guestbook.css'
import '../Guestbook/PhotoBooth.css'

const DEFAULT_PHOTO_FORM = {
  toName: '',
  fromName: '',
  message: '',
  frameColor: PASTEL_COLORS[0].value,
}

const MAX_UPLOAD_SIZE = 8 * 1024 * 1024

async function renderPolaroidToBlob(element) {
  if (!element) throw new Error('완성할 폴라로이드를 찾을 수 없습니다.')
  await document.fonts.ready
  for (const image of element.querySelectorAll('img')) await image.decode()

  const rect = element.getBoundingClientRect()
  const clone = element.cloneNode(true)
  clone.setAttribute('aria-hidden', 'true')
  const originals = [element, ...element.querySelectorAll('*')]
  const copies = [clone, ...clone.querySelectorAll('*')]
  originals.forEach((original, index) => {
    const computed = getComputedStyle(original)
    for (const property of computed) {
      copies[index].style.setProperty(property, computed.getPropertyValue(property))
    }
  })

  // Freeze the editor geometry, replacing controls with their actual values only.
  for (const original of element.querySelectorAll('input, textarea')) {
    const copy = copies[originals.indexOf(original)]
    const text = document.createElement('div')
    text.style.cssText = copy.style.cssText
    const size = original.getBoundingClientRect()
    Object.assign(text.style, {
      width: `${size.width}px`, height: `${size.height}px`,
      minHeight: `${size.height}px`, flex: 'none', whiteSpace: 'pre-wrap',
      overflow: 'hidden',
    })
    text.textContent = original.value.trim() ? original.value : ''
    if (original.tagName === 'INPUT' && !original.value.trim()) {
      copy.previousElementSibling.style.visibility = 'hidden'
    }
    copy.replaceWith(text)
  }

  Object.assign(clone.style, {
    width: `${rect.width}px`, height: `${rect.height}px`,
    position: 'fixed', left: '-100000px', top: '0', margin: '0',
    borderColor: 'transparent', pointerEvents: 'none',
  })
  document.body.appendChild(clone)
  try {
    const blob = await toBlob(clone, {
      width: rect.width, height: rect.height, pixelRatio: 3,
      includeStyleProperties: [],
      style: { position: 'relative', left: '0', top: '0' },
    })
    if (!blob) throw new Error('완성 이미지를 생성하지 못했습니다.')
    return blob
  } finally {
    clone.remove()
  }
}

function GuestbookModal({ children, onClose, className = '', labelledBy }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="gb-modal" role="presentation">
      <div className="gb-modal__overlay" aria-hidden="true" />
      <div
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={`gb-modal__dialog ${className}`}
        role="dialog"
      >
        {children}
      </div>
      <button
        aria-label="닫기"
        className="gb-modal__close"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        ×
      </button>
    </div>
  )
}

function captureVideoFrame(video) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 900
  const ctx = canvas.getContext('2d')
  const videoRatio = video.videoWidth / video.videoHeight
  const targetRatio = canvas.width / canvas.height
  let sourceWidth = video.videoWidth
  let sourceHeight = video.videoHeight
  let sourceX = 0
  let sourceY = 0

  if (videoRatio > targetRatio) {
    sourceWidth = video.videoHeight * targetRatio
    sourceX = (video.videoWidth - sourceWidth) / 2
  } else {
    sourceHeight = video.videoWidth / targetRatio
    sourceY = (video.videoHeight - sourceHeight) / 2
  }

  ctx.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  return canvas.toDataURL('image/png')
}

function CameraCapture({ onCapture, onUpload }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const [cameraError, setCameraError] = useState('')
  const [countdown, setCountdown] = useState(null)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('이 브라우저에서는 카메라를 사용할 수 없습니다.')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 960 },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (error) {
        setCameraError(
          error.name === 'NotAllowedError'
            ? '카메라 권한이 거부되었습니다. 이미지 업로드를 이용해주세요.'
            : error.message,
        )
      }
    }

    startCamera()

    return () => {
      cancelled = true
      window.clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function handleStartCountdown() {
    if (!videoRef.current || cameraError || countdown) return
    let nextValue = 5
    setCountdown(nextValue)
    timerRef.current = window.setInterval(() => {
      nextValue -= 1
      if (nextValue <= 0) {
        window.clearInterval(timerRef.current)
        const image = captureVideoFrame(videoRef.current)
        setCountdown(null)
        onCapture(image)
        return
      }
      setCountdown(nextValue)
    }, 1000)
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('JPG, PNG, WebP 형식만 업로드할 수 있습니다.')
      return
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setUploadError('이미지는 8MB 이하로 업로드해주세요.')
      return
    }

    setUploadError('')
    const reader = new FileReader()
    reader.onload = () => onUpload(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="gb-camera">
        {cameraError ? (
          <p className="gb-camera__fallback">{cameraError}</p>
        ) : (
          <video
            aria-label="카메라 미리보기"
            autoPlay
            className="gb-camera__video"
            muted
            playsInline
            ref={videoRef}
          />
        )}
        {countdown && <span className="gb-camera__count">{countdown}</span>}
      </div>
      {!countdown && <>
      <div className="gb-photo-actions">
        <button
          className="gb-button gb-button--primary"
          disabled={Boolean(cameraError || countdown)}
          onClick={handleStartCountdown}
          type="button"
        >
          촬영 시작 <Camera aria-hidden="true" size={16} />
        </button>
        <label className="gb-upload-button">
          이미지 업로드 <Upload aria-hidden="true" size={18} />
          <input
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            type="file"
          />
        </label>
      </div>
      <p className="gb-photo-hint">
        촬영 시작 선택 시, 5초 후에 자동 촬영됩니다.
      </p>
      {uploadError && <p className="gb-modal-error">{uploadError}</p>}
      </>}
    </>
  )
}

function PolaroidPreview({
  imageSrc,
  toName,
  fromName,
  message,
  frameColor,
  editable = false,
  onChange,
  frameRef,
}) {
  const inputProps = (field, maxLength) => ({
    value: field === 'toName' ? toName : field === 'fromName' ? fromName : message,
    maxLength,
    onChange: (event) => onChange?.(field, event.target.value),
  })

  return (
    <div className="gb-polaroid" ref={frameRef} style={{ '--gb-polaroid-color': frameColor }}>
      <div className="gb-polaroid__photo">
        {imageSrc ? <img src={imageSrc} alt="" /> : <span>PHOTO</span>}
      </div>
      <div className="gb-polaroid__text">
        <label className="gb-polaroid__field gb-polaroid__field--to">
          <span style={{ visibility: editable || toName?.trim() ? 'visible' : 'hidden' }}>To.</span>
          {editable ? (
            <input
              aria-label="받는 사람"
              placeholder="OOO"
              {...inputProps('toName', 24)}
            />
          ) : (
            <strong>{toName?.trim() ? toName : ''}</strong>
          )}
        </label>
        {editable ? (
          <textarea
            aria-label="사진 메시지"
            className="gb-polaroid__message-input"
            placeholder="최대 50자 이내로 원하는 메시지를 입력할 수 있습니다."
            {...inputProps('message', 50)}
          />
        ) : (
          <p className="gb-polaroid__message">
            {message?.trim() ? message : ''}
          </p>
        )}
        <label className="gb-polaroid__field gb-polaroid__field--from">
          <span style={{ visibility: editable || fromName?.trim() ? 'visible' : 'hidden' }}>From.</span>
          {editable ? (
            <input
              aria-label="보내는 사람"
              placeholder="OOO"
              {...inputProps('fromName', 24)}
            />
          ) : (
            <strong>{fromName?.trim() ? fromName : ''}</strong>
          )}
        </label>
      </div>
    </div>
  )
}

function PolaroidEditor({
  form,
  imageSrc,
  onBack,
  onChange,
  onNext,
  frameRef,
}) {
  return (
    <>
      <div className="gb-editor">
        <PolaroidPreview
          editable
          frameRef={frameRef}
          frameColor={form.frameColor}
          fromName={form.fromName}
          imageSrc={imageSrc}
          message={form.message}
          onChange={onChange}
          toName={form.toName}
        />
        <div className="gb-palette" aria-label="프레임 색상 선택">
          <span className="gb-palette__top" aria-hidden="true">
            ⌄
          </span>
          {PASTEL_COLORS.map((color) => (
            <button
              aria-label={`${color.name} 색상`}
              className={
                form.frameColor === color.value
                  ? 'gb-palette__swatch gb-palette__swatch--active'
                  : 'gb-palette__swatch'
              }
              key={color.value}
              onClick={() => onChange('frameColor', color.value)}
              style={{ '--gb-swatch-color': color.value }}
              type="button"
            />
          ))}
        </div>
      </div>
      <div className="gb-editor-actions">
        <button className="gb-button gb-button--muted" onClick={onBack}>
          다시 촬영하기
        </button>
        <button
          className="gb-button gb-button--primary"
          onClick={onNext}
        >
          다음
        </button>
      </div>
    </>
  )
}

function QRModal({ imageUrl, onBack, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function makeCode() {
      try {
        const dataUrl = await QRCode.toDataURL(imageUrl, {
          margin: 1,
          width: 330,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        })
        if (!ignore) setQrDataUrl(dataUrl)
      } catch (requestError) {
        if (!ignore) setError(requestError.message)
      }
    }

    if (imageUrl) makeCode()

    return () => {
      ignore = true
    }
  }, [imageUrl])

  return (
    <div className="gb-qr" role="dialog" aria-modal="true">
      <div className="gb-qr__box">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="완성 이미지로 연결되는 QR 코드" />
        ) : (
          <p>{error || 'QR 코드를 준비하는 중입니다.'}</p>
        )}
      </div>
      <div className="gb-qr__actions">
        <button aria-label="뒤로가기" onClick={onBack} type="button">
          ↩
        </button>
        <button aria-label="닫기" onClick={onClose} type="button">
          ×
        </button>
      </div>
    </div>
  )
}

function PhotoBooth({ onClose, onCreated }) {
  const frameRef = useRef(null)
  const resultRef = useRef(null)
  const renderingRef = useRef(false)
  const [step, setStep] = useState('capture')
  const [imageSrc, setImageSrc] = useState('')
  const [form, setForm] = useState(DEFAULT_PHOTO_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [publicImageUrl, setPublicImageUrl] = useState('')
  const [resultUrl, setResultUrl] = useState('')

  useEffect(() => () => {
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url)
  }, [])

  const handleImageReady = useCallback((nextImage) => {
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url)
    resultRef.current = null
    setResultUrl('')
    setImageSrc(nextImage)
    setForm(DEFAULT_PHOTO_FORM)
    setPublicImageUrl('')
    setError('')
    setStep('edit')
  }, [])

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleFinishEditing() {
    if (renderingRef.current) return
    renderingRef.current = true
    setError('')
    try {
      const blob = await renderPolaroidToBlob(frameRef.current)
      if (!frameRef.current) return
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url)
      const url = URL.createObjectURL(blob)
      resultRef.current = { blob, url, uploaded: null, uploading: null }
      setResultUrl(url)
      setStep('preview')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      renderingRef.current = false
    }
  }

  async function ensurePublicPolaroid() {
    const result = resultRef.current
    if (!result) throw new Error('완성 이미지가 준비되지 않았습니다.')
    if (result.uploaded) return result.uploaded
    if (!result.uploading) {
      result.uploading = uploadGuestbookImage(result.blob, 'polaroids')
        .then((uploaded) => {
          result.uploaded = uploaded
          return uploaded
        })
        .finally(() => { result.uploading = null })
    }
    const uploaded = await result.uploading
    setPublicImageUrl(uploaded.publicUrl)
    return uploaded
  }

  async function handleSave() {
    if (isSaving) return
    setIsSaving(true)
    setError('')

    try {
      const uploaded = await ensurePublicPolaroid()
      const entry = await createGuestbookEntry({
        type: 'photo',
        toName: form.toName,
        fromName: form.fromName,
        message: form.message,
        frameColor: form.frameColor,
        imagePath: uploaded.path,
        imageUrl: uploaded.publicUrl,
        qrImagePath: uploaded.path,
      })
      onCreated(entry)
      onClose()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }


  async function handleShare() {
    try {
      const { publicUrl: url } = await ensurePublicPolaroid()
      if (navigator.share) {
        await navigator.share({
          title: 'Guestbook Polaroid',
          text: '완성한 게스트북 폴라로이드입니다.',
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setError('공유 링크를 클립보드에 복사했습니다.')
      }
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleOpenQr() {
    try {
      await ensurePublicPolaroid()
      setStep('qr')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <GuestbookModal
      className={`gb-modal__dialog--photo gb-modal__dialog--${step}`}
      labelledBy="gb-photo-title"
      onClose={onClose}
    >
      <h2 className="gb-sr-only" id="gb-photo-title">
        포토부스
      </h2>

      {step === 'capture' && (
        <CameraCapture onCapture={handleImageReady} onUpload={handleImageReady} />
      )}

      {step === 'edit' && (
        <PolaroidEditor
          form={form}
          imageSrc={imageSrc}
          onBack={() => setStep('capture')}
          onChange={updateForm}
          onNext={handleFinishEditing}
          frameRef={frameRef}
        />
      )}

      {step === 'preview' && (
        <>
          <img className="gb-polaroid-result" src={resultUrl} alt="완성된 폴라로이드" />
          <div className="gb-preview-actions">
            <button
              className="gb-button gb-button--primary"
              disabled={isSaving}
              onClick={handleSave}
              type="button"
            >
              {isSaving ? '공유 중...' : '게스트북에 공유하기'}
            </button>
            
            <button
              aria-label="공유"
              className="gb-icon-button"
              onClick={handleShare}
              type="button"
            >
              ⤴
            </button>
            <button
              aria-label="QR 코드"
              className="gb-icon-button"
              onClick={handleOpenQr}
              type="button"
            >
              ▦
            </button>
          </div>
        </>
      )}

      {step === 'qr' && (
        <QRModal
          imageUrl={publicImageUrl}
          onBack={() => setStep('preview')}
          onClose={onClose}
        />
      )}

      {error && <p className="gb-modal-error">{error}</p>}
    </GuestbookModal>
  )
}

export { GuestbookModal }
export default PhotoBooth
