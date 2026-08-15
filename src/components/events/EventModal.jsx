import Modal from '../ui/Modal'
import EventDetails from './EventDetails'
import { useEvent } from '../../hooks/useEvents'
import { formatDate } from '../../lib/format'

// Opened from the calendar. Same body as the popup you get from a map pin.
export default function EventModal({ eventId, onClose }) {
  const event = useEvent(eventId)
  return (
    <Modal
      open={!!event}
      onClose={onClose}
      width={600}
      title={event?.title}
      subtitle={event ? `${formatDate(event.event_date)} · organized by ${event.org.name}` : ''}
    >
      <EventDetails event={event} />
    </Modal>
  )
}
