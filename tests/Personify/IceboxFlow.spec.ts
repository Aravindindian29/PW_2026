import { faker } from "@faker-js/faker";
import { test,expect } from "@playwright/test";
test(`Verifying Happypath flow`, async({page})=>{
await page.setViewportSize({ width: 1920, height: 1080 });

//TestDate
const Spotip = `https://adf-internal-icebox.adfdata.net/apply/org?src=ORG`;
const fName=faker.person.firstName().replace(/[^a-zA-Z\s]/g, '');
const mName=faker.person.middleName().replace(/[^a-zA-Z\s]/g, '');
const lName=faker.person.lastName().replace(/[^a-zA-Z\s]/g, '');
const email=`adfautomation.data` + faker.helpers.rangeToNumber({ min: 10000000, max: 99999999 }) + `@gmail.com`;
const address1= faker.location.streetAddress();
const city='LOS ANGELES';
const phNum1=faker.phone.number();
const phNum2=faker.phone.number();
const ssn=faker.helpers.rangeToNumber({ min: 100000000, max: 999999999 });
const loanAmt='4,000';
const monthlyIncome='5,000';
const routNo='999999969';
const bankNo=faker.helpers.rangeToNumber({ min: 10000000, max: 99999999 });

//Launching the website
await page.goto(Spotip);
await page.waitForLoadState('load')

//Landing page to Miniapp1 page
await page.locator(`#cookiePopupClose`).click();
await page.locator(`#txtZip`).fill(`32003`);
await page.locator(`#btn-Submit`).click();
await page.locator(`#txtFirstName`).fill(`${fName}`);
await page.locator(`#txtMiddleName`).fill(`${mName}`);
await page.locator(`#txtLastName`).fill(`${lName}`);
await page.selectOption(`#suffix`,{value:`Sr`});
await page.locator(`#btn-Submit`).click();
await page.locator(`(//input[@id='chkCheckPromocode'])[2]`).click();
await page.locator(`#btn-Submit`).click();
await page.locator(`#txtEmail`).fill(`${email}`);
await page.locator(`#btn-Submit`).click();



//Miniapp1 
await page.waitForLoadState('load')
await page.locator(`#txtStreetAddress`).fill(`${address1}`);
await page.locator(`#txtCity`).fill(`${city}`);
await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
const submitBtn=page.locator(`#btn-Submit`);
// expect(submitBtn).toBeVisible({timeout:11000});
await submitBtn.click();
// await page.locator(`#txtCity`).press('Enter')

await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
await page.locator(`#residence_type_2`).click();
await page.locator(`#btn-Submit`).click();
await page.waitForLoadState('load');

await page.locator(`#txtphone_1`).fill(`${phNum1}`);
await page.locator(`#phone_1_type_2`).click();
await page.locator(`#phone_add`).click();
await page.locator(`#txtphone_2`).fill(`${phNum2}`);
await page.locator(`#phone_2_type_1`).click();
await page.locator(`#btn-Submit`).click();
await page.waitForLoadState('load');
// await page.evaluate(() => {
//     window.scrollTo(0, 0);
//   });
await page.selectOption(`(//select[@class='form-control form-select mb-0 mb-sm-2'])[1]`,{value:`3`});
await page.selectOption(`(//select[@class='form-control form-select mb-0 mb-sm-2'])[2]`,{value:`3`});
await page.selectOption(`//select[@class='form-control form-select mb-2']`,{value:`1995`});
await page.locator(`#btn-Submit`).click();
await page.waitForLoadState('load');
// await page.evaluate(() => {
//     window.scrollTo(0, 0);
//   });
await page.locator(`#txtSocialSecurity`).fill(`${ssn}`);
await page.locator(`#btn-Submit`).click();
await page.waitForLoadState('load');

//Loan Amount page
const loanAmtfield = page.locator("//input[@id='txtLoanAmount']");
await expect(loanAmtfield).toBeVisible({timeout:2000});
await loanAmtfield.fill(`${loanAmt}`);
await page.waitForTimeout(2000);
const subBtn= page.locator(`#btn-Submit`);
await expect(subBtn).toBeVisible({timeout:2000});
await page.waitForSelector('#btn-Submit:enabled', {timeout:2000});
await subBtn.click();

//Loan Purpose page
await expect(page.locator(`#ddlLoanPurpose`)).toBeEnabled();
await page.selectOption(`#ddlLoanPurpose`,{value:"14"});
await page.locator(`#btn-Submit`).click();

//Employment page
await page.waitForLoadState('load')
// const loader = await expect(page.locator("//div[@class='spinner']")).toBeHidden({timeout:15000});
await page.selectOption(`#ddlEmploymentStatus`,{value:"2"});
await page.selectOption(`#selfEmploymentType`,{value:"Sole Proprietorship"});
const monthlyInc =  page.locator(`#txtNetIncome`);
await expect(monthlyInc).toBeVisible({timeout:5000});
await monthlyInc.fill(`${monthlyIncome}`);
await page.selectOption(`#ddlPaymentSchedule_new`,{value:"2"});
await page.locator(`#payday_weekly_1`).click();
await expect(page.locator(`#btn-Submit`)).toBeVisible({timeout:3000});
//await page.waitForTimeout(2000);
await page.locator(`#btn-Submit`).click();

//Miniapp4
await page.waitForTimeout(3000);
const agreeCommunication= page.locator("#agree_communication");
// await expect(agreeCommunication).toBeVisible({timeout:5000});
await page.locator("#agree_communication").click();

const agreeTelephone= page.locator("#agree_telephone");
// await expect(agreeTelephone).toBeVisible({timeout:3000});
await page.locator("#agree_telephone").click();

const agreeVerification= page.locator("#agree_verification");
// await expect(agreeVerification).toBeVisible({timeout:2000});
await page.locator("#agree_verification").click();

const agreePrivacy= page.locator("#agree_privacy");
// await expect(agreePrivacy).toBeVisible({timeout:2000});
await page.locator("#agree_privacy").click();

const military= page.locator("#id_agree_military_0");
// await expect(military).toBeVisible({timeout:2000});
await page.locator("#id_agree_military_0").click();

const agreeArbitration= page.locator("#agree_arbitration");
// await expect(agreeArbitration).toBeVisible({timeout:2000});
await page.locator("#agree_arbitration").click();

const agreeThirdparty= page.locator("#agree_thirdparty");
// await expect(agreeThirdparty).toBeVisible({timeout:2000});
await page.locator("#agree_thirdparty").click();
await page.locator("//span[text()='Confirm and Continue']").click();

//Offer Page
//await page.waitForTimeout(3000);
await page.waitForLoadState('load')
await page.locator("(//button[@id='featured_offer'])[2]").click();
await page.locator("(//button[@class='btn-default btn btn-primary'])[2]").click();

//BankData Page
await page.locator("#txtBankRouting").fill(`${routNo}`);
await page.locator("#txtBankAccount").fill(`${bankNo}`);
// await page.locator("#online_or_mobile_banking_1").click();
await page.locator("#btn-Submit").click();

//Repayment Page
await page.waitForLoadState('load')
await page.locator("#repayment_method_0").click();
await page.locator("#repaymentSubmit").click();

//Esign Page
await page.waitForLoadState('load')
await page.locator("#txtFirstNameTPC").fill(`${fName}`);
await page.locator("#txtMiddleNameTPC").fill(`${mName}`);
await page.locator("#txtLastNameTPC").fill(`${lName}`);
await page.selectOption(`#suffixTPC`,{value:`Sr`});
const lastdigits=ssn.toString().slice(5,10);
console.log(`The last for digits ${lastdigits}`);
await page.locator("#txtSocialSecurityTPC").fill(`${lastdigits}`);
await page.locator("(//button[@class='btn btn-large btn-primary'])[1]").click();
const agreeAuthorization= page.locator("#agree_terms");
await expect(agreeAuthorization).toBeVisible({timeout:2000});
await agreeAuthorization.click();

const agreeTerms= page.locator("//input[@id='agree_authorization_1']");
await expect(agreeTerms).toBeVisible({timeout:2000});
await agreeTerms.click();

const agree_Arbitration= page.locator("#agree_arbitration");
await expect(agree_Arbitration).toBeVisible({timeout:2000});
await agree_Arbitration.click();

const agree_Acknowledgements= page.locator("#agree_acknowledgements");
await expect(agree_Acknowledgements).toBeVisible({timeout:2000});
await agree_Acknowledgements.click();

const agreeEsignature= page.locator("#agree_esignature");
await expect(agreeEsignature).toBeVisible({timeout:2000});
await agreeEsignature.click();

await page.locator("#txtFirstName").fill(`${fName}`);
await page.locator("#txtMiddleName").fill(`${mName}`);
await page.locator("#txtLastName").fill(`${lName}`);
await page.selectOption(`#suffix`,{value:`Sr`});
const last4digits=ssn.toString().slice(5,10);
console.log(`The last for digits ${last4digits}`);
await page.locator("#txtSocialSecurity").fill(`${last4digits}`);
await page.locator("(//button[@class='btn btn-large btn-primary'])[2]").click();
await page.waitForTimeout(2000);

});