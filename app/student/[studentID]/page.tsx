import Navbar from "@/components/Navbar"
import UserProfile from "@/components/UserProfile"

export default function StudentProfile({ params }: {
    params: {
        studentID: string
    }
}) {
    return (
        <main>
            <Navbar />
            <UserProfile uid={params.studentID} />
        </main>
    )
}