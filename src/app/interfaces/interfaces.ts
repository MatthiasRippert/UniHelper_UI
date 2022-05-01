export interface IAnswer {
  idAnswer: number,
  answer: string,
  answerImage: string,
  newAnswer: boolean
}
export interface IAnswerImageFile {
  idAnswer: number,
  image: File
}
export interface ISubjectArea {
  idSubject: number,
  idSubjectArea: number,
  descriptionSubjectArea: string
}
export interface ISubject {
  idSubject: number,
  description: string,
  vocabulary: boolean
}

export interface IQuestion {
  idQuestion: number,
  prio: number,
  idSubject: number,
  subject: string,
  idSubjectArea: number,
  subjectArea: string,
  question: string,
  questionImage: string,
  idQuestionType: number,
  createdAt: Date
}

export interface IGetQuestionToAnswerRequest{
  prioFrom: number,
  prioTo: number,
  idSubject: number,
  idSubjectAreas: number[],
  orderByLastTimeAnswered: boolean
}

export interface IGetQuestionsRequest {
  idSubject: number,
  idsSubjectArea: number[],
  searchText: string
}
