import { browser, by, element } from 'protractor';

var filename = '/tmp/constellation.png';
var fs = require('fs');

export class AppPage {
  canvas:any;

  private TEST_IDS = {
    NAME: 'name',
    BUTTON: 'ok-button',
    LIST: 'point-list',
    WRITE: 'write-map',
    EXPORT:'export-map'
  };

  constructor(){
    this.canvas = element(by.className('ol-unselectable'));
    
  }

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('h1')).getText() as Promise<string>;
  }
  
  /**
   * 画像を吐き出す
   * 実装中（ダイアログが重複するため）
   */
  getImage(){
    return this.addPoint(50,50, 'test1').then(()=> {
      return this.addPoint(55,55, 'test2')
    }).then(()=> {
      const writeButton = element(by.xpath(this.xpathLocator(this.TEST_IDS.WRITE)));
       return writeButton.click();
    }).then(()=> {
      const exportButton = element(by.xpath(this.xpathLocator(this.TEST_IDS.EXPORT)));
      return exportButton.click();
    }).then(async ()=> {
      
      return browser.wait(()=> {
        return fs.existsSync(filename)
      },3000)
    }).then((result)=> {
      if(result){
        return true;
      }
    })
  }

  getListValue(){
    return element(by.xpath(this.xpathLocator(this.TEST_IDS.LIST))).getText() as Promise<string>
  }

  addPoint(toRight:number,toLeft:number, name:string){
    return this.clickCanvas(50,50).then(()=> {
      this.putPointDialog(name);
    });
  }

  private clickCanvas(toRight:number, toBottom:number){
    return browser.actions()
      .mouseMove(this.canvas, {x: toRight, y: toBottom})
      .click()
      .perform();
  }

  /**
   * ダイアログのinputに値を入れ、ダイアログを閉じる
   * 参考:https://qiita.com/nishiemon/items/d774c17476c9f7d8ad6a
   */
  private putPointDialog(name:string){
    const input = element(by.xpath(this.xpathLocator(this.TEST_IDS.NAME)));
    input.sendKeys(name);
    const okButton = element(by.xpath(this.xpathLocator(this.TEST_IDS.BUTTON)));
    return okButton.click();
  }

  private xpathLocator(id: string) {
    return `//*[contains(@data-test, "${id}")]`;
  }
}
