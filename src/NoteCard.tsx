import { Draggable } from "react-beautiful-dnd"
import { Stack, Card, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import styles from "./NotesList.module.css"
import { SimplifiedNote } from "./Type"

export function NoteCard({ _id, title, tags }: SimplifiedNote) {
  return (
    <Link
      to={`/${_id}`}
      className="text-reset text-decoration-none w-full h-full flex align-items-center"
    >
      <div className=" w-full pl-3">
        <span className="font-semibold text-lg">{title}</span>
        {tags.length > 0 && (
          <div className="flex">
            {tags.map((tag) => (
              <div
                className="text-truncate mr-3 border-2 rounded-full px-2 border-[#3864A5] text-xs group-hover:border-white"
                key={tag._id}
              >
                {tag.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
