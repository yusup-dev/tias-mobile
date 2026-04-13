# API Contract V1 (Attendance Face + CBT Similarity)

Dokumen ini adalah kontrak awal antara mobile app dan service AI/backend.

## 1) Attendance Face Verify

Endpoint:
- `POST /attendance/face-verify`

Request body:
```json
{
  "npm": "string",
  "tokenAbsensi": "string",
  "imageBase64": "string",
  "lat": -6.12345,
  "long": 106.12345,
  "deviceId": "string",
  "timestamp": "2026-02-26T10:00:00.000Z"
}
```

Response body:
```json
{
  "verified": true,
  "confidence": 0.91,
  "message": "Face verified",
  "attendanceId": "string"
}
```

Error response:
```json
{
  "verified": false,
  "confidence": 0.32,
  "message": "Face mismatch"
}
```

## 2) CBT Answer Similarity Score

Endpoint:
- `POST /cbt/answer-score`

Request body:
```json
{
  "examId": "string",
  "questionId": "string",
  "studentId": "string",
  "answerText": "string"
}
```

Response body:
```json
{
  "similarityScore": 82.5,
  "grade": "A-",
  "feedback": "Jawaban cukup sesuai dengan referensi.",
  "referenceAnswerId": "string"
}
```

## 3) List Exam CBT

Endpoint:
- `GET /cbt/exams`

Response body:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "startedAt": "2026-02-26T10:00:00.000Z",
      "endedAt": "2026-02-26T11:00:00.000Z",
      "status": "upcoming"
    }
  ]
}
```

## 4) List Questions CBT

Endpoint:
- `GET /cbt/exams/{examId}/questions`

Response body:
```json
{
  "data": [
    {
      "id": "string",
      "examId": "string",
      "questionText": "string",
      "maxScore": 100
    }
  ]
}
```
