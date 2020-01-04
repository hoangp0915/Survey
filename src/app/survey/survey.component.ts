import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { GetDataService } from '../services/get-data.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
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
  @ViewChild('select', { static: false }) input: ElementRef;
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
  constructor(private getDataService: GetDataService, private dragula: DragulaService, private fb: FormBuilder) {
    this.createForm();
    dragula.createGroup('COPYABLE', {
      copy: (el, source) => {
        return source.id === 'left';
      },
      copyItem: (questionType: any) => {
        this.dragQuestion(questionType.type);
        return { type: questionType.type };
      },
      accepts: (el, target, source, sibling) => {
        return target.id !== 'left';
      }
    });

  }
  ngOnInit(): void {
    // this.getDataService.getData().subscribe((res: any[]) => {
    //   console.log('TCL: AppComponent -> res', res);
    //   this.listTask = res;
    // });
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
    const answers = this.questions.get(`${0}.answers`) as FormArray;
    answers.push(this.createAnswer());
    answers.get(`${0}.answer`).setValue(`Tùy chọn 1`)
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

  dragQuestion(type) {
    this.lisSub.push(
      this.dragula.dropModel('COPYABLE').pipe(take(1)).subscribe(res => {
        if (res.source.id === 'left') {
          this.questions.insert(res.targetIndex, this.createQuestion());
          this.questions.get(`${res.targetIndex}.type`).setValue(type);
          this.questions.get(`${res.targetIndex}.question`).setValue(`Câu hỏi không có tiêu đề`);
          const answers = this.questions.get(`${res.targetIndex}.answers`) as FormArray;
          answers.push(this.createAnswer());
          answers.push(this.createAnswer());
          answers.controls.forEach((item, index) => {
            answers.get(`${index}.answer`).setValue(`Tùy chọn ${index + 1}`);
          });
        }
      })
    );
  }

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  removeQuestion(indexQ) {
    if (this.questions.length === 1) { return; }
    this.questions.removeAt(indexQ);
  }

  addAnswer(indexQ){
    const answers = this.questions.get(`${indexQ}.answers`) as FormArray;
    answers.push(this.createAnswer());
  }

  removeAnswer(indexQ, indexA){
    const answers = this.questions.get(`${indexQ}.answers`) as FormArray;
    answers.removeAt(indexA);
  }

  save() {
    console.log(this.surveyForm.value);
  }

  ngOnDestroy(): void {
    this.lisSub.forEach(sub => sub.unsubscribe());
  }
}
