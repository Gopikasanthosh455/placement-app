import NotificationJobsPage from "./cards/notificationJobsCard";

export default function JobNotification({ uid }: { uid: string }) {

    return (
        <main>
            <h1 className="text-lg text-black font-semibold">Recommended jobs</h1>
            <NotificationJobsPage uid={uid} />
        </main>
    )
}
