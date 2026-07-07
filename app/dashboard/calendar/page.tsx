import { PageTitle, Panel, PlatformPill } from "@/components/ui";
import { calendarPosts } from "@/lib/mock-data";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

export default function CalendarPage() {
  return (
    <>
      <PageTitle
        eyebrow="Content calendar"
        title="July publishing plan"
        description="Plan daily posts, drag campaigns into slots later, and show clients a professional scheduling experience."
        action={<button className="btn">Add schedule</button>}
      />
      <Panel title="Monthly calendar" hint="Toronto timezone is the default for this demo.">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => <PlatformPill key={day} label={day} />)}
        </div>
        <div className="calendar-grid">
          {days.map((day) => {
            const posts = calendarPosts.filter((post) => post.day === day);
            return (
              <div className={`day-card ${day === 7 ? "today" : ""}`} key={day}>
                <div className="day-number">{day}</div>
                {posts.map((post) => <span className="day-post" key={post.label}>{post.label}</span>)}
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
