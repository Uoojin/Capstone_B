import { useMemo, useState } from 'react'
import { GuestbookModal } from '../Guestbook/PhotoBooth.jsx'
import { createGuestbookEntry } from '../../lib/supabase02.js'
import '../Guestbook/Message.css'


const MAX_TEXT_MESSAGE = 250
const MIN_TEXT_MESSAGE = 10

function Message({ onClose, onSubmit }) {
  const [toName, setToName] = useState('')
  const [fromName, setFromName] = useState('')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(
    () =>
      message.trim().length >= MIN_TEXT_MESSAGE &&
      message.trim().length <= MAX_TEXT_MESSAGE &&
      toName.trim().length > 0 &&
      fromName.trim().length > 0,
    [fromName, message, toName],
  )

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit || isSaving) return
    setIsSaving(true)
    setError('')

    try {
      const frameColor = '#FFFFFF'
      const entry = await createGuestbookEntry({
        type: 'message',
        toName: toName.trim(),
        fromName: fromName.trim(),
        message: message.trim(),
        frameColor,
      })
      await onSubmit(entry)
      onClose()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <GuestbookModal
      className="gb-modal__dialog--message"
      labelledBy="gb-message-title"
      onClose={onClose}
    >
      <h2 className="gb-sr-only" id="gb-message-title">
        메시지 남기기
      </h2>
      <form className="gb-message-form" onSubmit={handleSubmit}>
        <div className="gb-message-form__row">
          <label>
            <span>To.</span>
            <input
              maxLength={24}
              onChange={(event) => setToName(event.target.value)}
              placeholder="OOO"
              value={toName}
            />
          </label>
          <label>
            <span>From.</span>
            <input
              maxLength={24}
              onChange={(event) => setFromName(event.target.value)}
              placeholder="OOO"
              value={fromName}
            />
          </label>
        </div>
        <label className="gb-message-form__textarea">
          <textarea
            maxLength={MAX_TEXT_MESSAGE}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="10자 이상 250자 이하로 메시지를 남겨주세요."
            value={message}
          />
          <span>
            {message.length} / {MAX_TEXT_MESSAGE}
          </span>
        </label>
        <button
          className="gb-button gb-button--primary gb-message-form__submit"
          disabled={!canSubmit || isSaving}
          type="submit"
        >
          {isSaving ? '보내는 중...' : '보내기'}
        </button>
        {error && <p className="gb-modal-error">{error}</p>}
      </form>
    </GuestbookModal>
  )
}

export default Message
