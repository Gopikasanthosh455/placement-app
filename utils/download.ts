import * as XLSX from 'xlsx';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { database } from '@/config.firebase.js';

interface StudentProfile {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Email: string;
  Institution: string;
  Profile: string;
}

const fetchSelectedStudentProfilesAsExcel = async (studentUIDs: string[]) => {
  try {
    
    const studentsQuery = query(collection(database, 'users'), where('__name__', 'in', studentUIDs));
    const studentsSnapshot = await getDocs(studentsQuery);
    
    const studentsData: StudentProfile[] = [];

    studentsSnapshot.forEach((doc) => {
      const studentData = doc.data();
      if (studentData.role === 'student') {
        const profileURL = `http://localhost:3000/student/${doc.id}`;
        studentsData.push({
          FirstName: studentData.firstName,
          LastName: studentData.lastName,
          PhoneNumber: studentData.phoneNumber,
          Email: studentData.email,
          Institution: studentData.institution,
          Profile: profileURL
        });
      }
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(studentsData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Students');
    const excelFileBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(excelFileBinary)], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'selected_students.xlsx';
    link.click();

  } catch (error) {
    console.error('Error fetching selected student profiles:', error);
  }
};

const s2ab = (s: string) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

export default fetchSelectedStudentProfilesAsExcel