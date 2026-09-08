import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Firebase Cloud Function v2 Trigger
 * Listens for new document creations in the 'PendingApplications' collection.
 * Automatically pushes a real-time alert into the 'Notifications' collection.
 */
export const onNewPendingApplication = onDocumentCreated(
  {
    document: "PendingApplications/{appId}",
    region: "us-central1",
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.error("No document snapshot found in trigger event.");
      return;
    }

    const appData = snapshot.data();
    const appId = event.params.appId;

    const applicantName = appData.fullName || "Unknown Candidate";
    const phoneNumber = appData.phoneNumber || "N/A";
    const classGrade = appData.classGradeSelection || "N/A";
    const facultyStream = appData.facultyStream || "";

    console.log(`[TRIGGER] Processing new lead application ${appId} for ${applicantName}`);

    try {
      const notificationRef = admin.firestore().collection("Notifications").doc();
      await notificationRef.set({
        id: notificationRef.id,
        applicationId: appId,
        type: "NEW_LEAD_APPLICATION",
        title: "New Admission Lead Received",
        applicantName,
        phoneNumber,
        classGrade,
        facultyStream,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        unread: true,
      });

      console.log(`[SUCCESS] Generated alert ${notificationRef.id} for lead ${appId}`);
    } catch (error) {
      console.error(`[ERROR] Failed to push notification alert for ${appId}:`, error);
    }
  }
);
