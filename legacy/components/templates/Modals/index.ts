// ...existing code...
// Modals template wrapper for atomic design migration
import AddTaskModal from "./AddTaskModal"
import EditTaskModal from "./EditTaskModal"
import AddBookmarkModal from "./AddBookmarkModal"
import BackupModal from "./BackupModal"
import RestoreModal from "./RestoreModal"

export default function Modals() {
  return (
    <>
      <AddTaskModal />
      <EditTaskModal />
      <AddBookmarkModal />
      <BackupModal />
      <RestoreModal />
    </>
  )
}
