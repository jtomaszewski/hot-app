export declare class HotApp {
  public data: any;
  
  private rootElementHtml: string;
  private startFn: Function;
  private stopFn: Function;
  private _isRunning: boolean;

  constructor(options: {
    getRootElement: () => HTMLElement,
    startFn: (app: HotApp, onStart: Function) => void,
    stopFn: (app: HotApp, onStop: Function) => void,
    oldApp?: HotApp
  });

  public isRunning(): boolean;
  public start(afterStart?: Function): void;
  public startOnDOMReady(afterStart?: Function): void;
  public stop(afterStop?: Function): void;
  public restart(afterRestart?: Function): void;

  public getRootElement(): HTMLElement;
}
