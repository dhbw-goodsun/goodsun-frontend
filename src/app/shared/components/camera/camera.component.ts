import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})

export class CameraComponent  implements OnInit, OnDestroy {

  constructor(private elementRef: ElementRef) { }

  isScanning: boolean = false
  isScanComplete: boolean = false;

  videoStream: MediaStream | null = null;

  @Input() isFullCircleScanned: boolean = false;
  @Output() startScanEvent = new EventEmitter<boolean>();
  @Output() endScanEvent = new EventEmitter();


  /* Starting camera. Request permission */
  ngOnInit(): void {
    const videoElement: HTMLVideoElement = this.elementRef.nativeElement.querySelector('video');
    /* Set rear camera as default */
    const rearCameraConstraints = { video: { facingMode: { exact: 'environment' } } };

    navigator.mediaDevices.getUserMedia(rearCameraConstraints)
      .then((stream) => {
        videoElement.srcObject = stream;
        this.videoStream = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }


  /* Ending camera when component is unloaded */
  ngOnDestroy(): void { 
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  /* When start button is pushed, event is being emitted for parent component to be reconized */
  startScanButton() {
    this.isScanning = true;
    this.startScanEvent.emit(this.isScanning);
  }

  /* When end button is pushed, event is being emitted for parent component to be reconized */
  endScanButton() {
    this.isScanComplete = true;
    this.isScanning = false;
    this.endScanEvent.emit();
  }
}