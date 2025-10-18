export class ApiClient {
  async fetchStudentRecords() {
    return [
      { id: 's-1', score: 4.0 },
      { id: 's-2', score: 3.8 },
    ];
  }

  async postGrades(records: Array<{ id: string; score: number }>) {
    return { status: 'ok', count: records.length };
  }
}
