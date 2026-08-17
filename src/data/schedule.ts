export interface ClassItem {
  mk: string;
  dosen: string;
  ruang: string;
  gedung: string;
  jam: string;
  sel: string;
}

export interface Student {
  no?: number;
  id: string;
  nm: string;
}

export interface GroupItem {
  n: string;
  a: Student[];
}

export interface SubjectGroup {
  dosen: string;
  k: GroupItem[];
}

export const scheduleData: Record<string, ClassItem[]> = {
  senin: [
    { mk: "Saluran Transmisi", dosen: "Ipan Suandi, S.T., M.T.", ruang: "Ruang 10", gedung: "Gedung 1", jam: "07:30", sel: "09:10" },
    { mk: "Praktikum Komunikasi Data", dosen: "Fakhrur Razi, S.ST., M.T.", ruang: "Lab 11", gedung: "Gedung 2", jam: "09:10", sel: "12:00" },
  ],
  selasa: [
    { mk: "Komunikasi Data", dosen: "Fakhrur Razi, S.ST., M.T.", ruang: "Ruang 10", gedung: "Gedung 1", jam: "07:30", sel: "09:10" },
    { mk: "Pendidikan Kewarganegaraan", dosen: "Novy Quentiena R., SH., MH.", ruang: "Ruang 4", gedung: "Gedung 1", jam: "09:10", sel: "11:10" },
  ],
  rabu: [
    { mk: "Praktikum Teknik Gelombang Mikro", dosen: "Munawar, S.T., M.T.", ruang: "Lab 23", gedung: "Gedung 2", jam: "07:30", sel: "10:00" },
    { mk: "Sistem Komunikasi Serat Optik", dosen: "Anita Fauziah, S.ST., M.T.", ruang: "Ruang 26", gedung: "Gedung 4", jam: "10:20", sel: "12:50" },
  ],
  kamis: [
    { mk: "Praktikum Saluran Transmisi", dosen: "Ipan Suandi, S.T., M.T.", ruang: "Lab 23", gedung: "Gedung 2", jam: "07:30", sel: "10:00" },
    { mk: "Teknik Gelombang Mikro", dosen: "Munawar, S.T., M.T.", ruang: "Ruang 16", gedung: "Gedung 3", jam: "10:20", sel: "12:00" },
  ],
  jumat: [
    { mk: "Praktikum Jaringan Komputer", dosen: "Hanafi, S.T., M.T.", ruang: "Lab 13", gedung: "Gedung 2", jam: "07:30", sel: "10:00" },
    { mk: "Jaringan Komputer", dosen: "Hanafi, S.T., M.T.", ruang: "Ruang 29", gedung: "Gedung 4", jam: "10:20", sel: "12:00" },
  ],
};

export const studentList: Student[] = [
  { no: 1, id: "2024203020013", nm: "Afriansyah Sinamo" },
  { no: 2, id: "2024203020028", nm: "Aqil Ocean Difra" },
  { no: 3, id: "2024203020011", nm: "Durratul Hikmah" },
  { no: 4, id: "2024203020025", nm: "Farhan Alfarsiyi" },
  { no: 5, id: "2024203020009", nm: "Firlita Afianti" },
  { no: 6, id: "2024203020001", nm: "Ilal Ilhamdi" },
  { no: 7, id: "2024203020019", nm: "Khairul Fajar Sidiq" },
  { no: 8, id: "2024203020032", nm: "Lunna Auamara" },
  { no: 9, id: "2024203020022", nm: "Muhammad Halfi Al Barizi" },
  { no: 10, id: "2024203020029", nm: "Muhammad Rais" },
  { no: 11, id: "2024203020036", nm: "Nazar Al Farabi" },
  { no: 12, id: "2024203020020", nm: "Nesya Zikriya" },
  { no: 13, id: "2024203020008", nm: "Rahmat Haikal" },
  { no: 14, id: "2024203020016", nm: "Renka Laura" },
  { no: 15, id: "2024203020003", nm: "Sarah Fonna" },
  { no: 16, id: "2024203020006", nm: "Suheil Maulana" },
  { no: 17, id: "2024203020031", nm: "Syawal Fitriyadi" },
];
