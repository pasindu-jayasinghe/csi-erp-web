import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subtask-form',
  templateUrl: './subtask-form.component.html',
  styleUrls: ['./subtask-form.component.scss']
})
export class SubtaskFormComponent implements OnInit {
  employees:any
  constructor() { }

  ngOnInit(): void {
  }
  saveSubTask(data:any){}
}
