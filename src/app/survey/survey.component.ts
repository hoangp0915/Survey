import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { GetDataService } from '../services/get-data.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragStart, CdkDragMove } from '@angular/cdk/drag-drop';
import { Tasks } from '../modal/Task';
import * as _ from 'lodash';
import { DragulaService } from 'ng2-dragula';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

export enum QuestionType {
  rating = 'rating',
  checkbox = 'checkbox',
  radio = 'radio',
  input = 'input'
}

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
  providers: [DragulaService]
})
export class SurveyComponent implements OnInit, OnDestroy {
  @ViewChild('myInput', { static: false }) myInput: ElementRef;
  surveyForm: FormGroup;
  listTask = [];
  questType = QuestionType;
  listAnswer: string[] = ['1', '2', '3'];
  listQuestion: string[] = ['1', '2', '3'];
  listQuestionType = [];
  lisSub: Subscription[] = [];
  questionType = [
    {
      title: 'Đánh giá',
      type: this.questType.rating,
      icon: ''
    },
    {
      title: 'Nhiều lựa chọn',
      type: this.questType.checkbox,
      icon: ''
    },
    {
      title: 'Một lựa chọn',
      type: this.questType.radio,
      icon: ''
    },
    {
      title: 'Tự nhập câu trả lời',
      type: this.questType.input,
      icon: ''
    }
  ];
  constructor(private getDataService: GetDataService, private fb: FormBuilder) {
    this.createForm();
  }
  ngOnInit(): void {
    this.setDefaultData()
  }
  createForm() {
    this.surveyForm = this.fb.group({
      name: ['', Validators.required],
      questions: this.fb.array([])
    });
  }
  createQuestion() {
    return this.fb.group({
      type: [this.questType.checkbox],
      question: [''],
      required: [false],
      answers: this.fb.array([])
    });
  }
  createAnswer() {
    return this.fb.group({
      answer: ['']
    });
  }

  setDefaultData() {
    this.surveyForm.get('name').setValue('Mẫu không có tiêu đề');
    this.questions.push(this.createQuestion());
    this.questions.get(`${0}.question`).setValue(`Câu hỏi 1`);
    const answers = this.questions.get(`${0}.answers`) as FormArray;
    answers.push(this.createAnswer());
    answers.get(`${0}.answer`).setValue(`Câu trả lời 1`);
  }

  setDataForm(data) {
    if (!data) { return; }
    this.surveyForm.value.name = data.name ? data.name : '';
    data.questions.forEach(question => {
      this.questions.push(this.createAnswer());
      this.questions.get('question').setValue(question.question ? question.question : '');
      this.questions.get('type').setValue(question.type);
    });
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  addQuestion(index?: number) {
    this.questions.push(this.createQuestion());
    setTimeout(() => {
      document.getElementById(`question_${index}`).focus();
    }, 20);
  }

  removeQuestion(indexQ) {
    if (this.questions.length === 1) { return; }
    this.questions.removeAt(indexQ);
  }

  addAnswer(indexQ) {
    const answers = this.questions.get(`${indexQ}.answers`) as FormArray;
    answers.push(this.createAnswer());
    answers.get(`${answers.length - 1}.answer`).setValue(`Câu trả lời ${answers.length}`);
    console.log('question_' + indexQ + '_answer_' + (answers.length - 1));
    setTimeout(() => {
      document.getElementById(`question_${indexQ}_answer_${answers.length - 1}`).focus();
    }, 20);
  }

  removeAnswer(indexQ, indexA) {
    const answers = this.questions.get(`${indexQ}.answers`) as FormArray;
    answers.removeAt(indexA);
  }

  save() {
    console.log(this.surveyForm.value);
  }

  itemDropped(event: CdkDragDrop<any[]>, indexQ?: number) {
    // currentIndex: questionIndex
    if (event.previousContainer === event.container) {
      const dir = event.currentIndex > event.previousIndex ? 1 : -1;
      const from = event.previousIndex;
      const to = event.currentIndex;
      if (indexQ !== undefined) {
        const answers = this.questions.get(`${indexQ}.answers`) as FormArray;
        this.setControl(from, dir, to, answers);
      } else {
        this.setControl(from, dir, to, this.questions);
      }
    } else {
      this.questions.insert(event.currentIndex, this.createQuestion());
      this.questions.get(`${event.currentIndex}.question`).setValue(`Câu hỏi ${event.currentIndex + 1}`);
      this.questions.get(`${event.currentIndex}.type`).setValue(event.item.data.type);
      const answers = this.questions.get(`${event.currentIndex}.answers`) as FormArray;
      answers.push(this.createAnswer());
      answers.get(`${0}.answer`).setValue(`Câu trả lời 1`);
      setTimeout(() => {
        document.getElementById(`question_${event.currentIndex}`).focus();
      }, 20);
    }
  }

  setControl(from, dir, to, controls: FormArray) {
    const temp = controls.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = controls.at(i + dir);
      controls.setControl(i, current);
    }
    controls.setControl(to, temp);
  }

  ngOnDestroy(): void {
    this.lisSub.forEach(sub => sub.unsubscribe());
  }
}
