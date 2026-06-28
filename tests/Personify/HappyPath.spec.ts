import { test, expect } from "@playwright/test";
import { dbConnection, filePostingBeforeMiniApp4, filePostingBeforeRePay, testData, testDataGenerator } from "./Utils";

test.describe.serial(`HappyPath E2E`, async () => {
    test(`Verifying Happypath flow`, async ({ page, request}) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        testDataGenerator();
        await page.goto(testData().ip_address)
        await page.waitForLoadState('load')

        //Landing page to Miniapp1 page
        await page.locator(`#cookiePopupClose`).click();
        await page.locator(`#txtZip`).fill(`32003`);
        await page.locator(`#btn-Submit`).click();
        await page.locator(`#txtFirstName`).fill(testData().firstName);
        await page.locator(`#txtMiddleName`).fill(testData().middleName);
        await page.locator(`#txtLastName`).fill(testData().lastName);
        await page.selectOption(`#suffix`, { value: `Sr` });
        await page.locator(`#btn-Submit`).click();
        await page.locator(`(//input[@id='chkCheckPromocode'])[2]`).click();
        await page.locator(`#btn-Submit`).click();
        await page.locator(`#txtEmail`).fill(testData().emailAddress);
        await page.locator(`#btn-Submit`).click();
        const url = page.url()
        console.log(url);
        const startIndex = url.indexOf('transactionid=') + 'transactionid='.length;

        // Find the end of the transactionid value
        const endIndex = url.indexOf('&', startIndex);
        // Slice the string to get the transactionid
        const transactionId = url.slice(startIndex, endIndex !== -1 ? endIndex : undefined);
        await dbConnection(transactionId);
        await page.reload();

        //Miniapp1 
        await page.waitForLoadState('load')
        await page.locator(`#txtStreetAddress`).fill(testData().addressLine1);
        await page.locator(`#txtCity`).fill(testData().City);
        const submitBtn = page.locator(`#btn-Submit`);
        await submitBtn.click();
        // await page.evaluate(() => {
        //     window.scrollTo(0, 0);
        //   });
        await page.locator(`#residence_type_2`).click();
        await page.locator(`#btn-Submit`).click();

        await page.locator(`#txtphone_1`).fill(testData().phNumber1);
        await page.locator(`#phone_1_type_2`).click();
        await page.locator(`#phone_add`).click();
        await page.locator(`#txtphone_2`).fill(testData().phNumber2);
        await page.locator(`#phone_2_type_1`).click();
        await page.locator(`#btn-Submit`).click();

        await page.selectOption(`(//select[@class='form-control form-select mb-0 mb-sm-2'])[1]`, { value: `3` });
        await page.selectOption(`(//select[@class='form-control form-select mb-0 mb-sm-2'])[2]`, { value: `3` });
        await page.selectOption(`//select[@class='form-control form-select mb-2']`, { value: `1995` });
        await page.locator(`#btn-Submit`).click();

        await page.locator(`#txtSocialSecurity`).fill(testData().ssnNumber.toString());
        await page.locator(`#btn-Submit`).click();

        //Loan Amount page
        await page.waitForLoadState('load')
        const loanAmtfield = page.locator("//input[@id='txtLoanAmount']");
        await expect(loanAmtfield).toBeVisible({ timeout: 2000 });
        await loanAmtfield.fill(testData().loanAmount);
        // await page.waitForTimeout(2000);
        const subBtn = page.locator(`#btn-Submit`);
        await expect(subBtn).toBeVisible({ timeout: 2000 });
        await page.waitForSelector('#btn-Submit:enabled', { timeout: 2000 });
        await subBtn.click();

        //Loan Purpose page
        await page.waitForLoadState('load')
        await expect(page.locator(`#ddlLoanPurpose`)).toBeEnabled();
        await page.selectOption(`#ddlLoanPurpose`, { value: "14" });
        await page.locator(`#btn-Submit`).click();

        //Employment page
        await page.waitForLoadState('load')
        // const loader = await expect(page.locator("//div[@class='spinner']")).toBeHidden({timeout:15000});
        await page.selectOption(`#ddlEmploymentStatus`, { value: "2" });
        await page.selectOption(`#selfEmploymentType`, { value: "Sole Proprietorship" });
        const monthlyInc = page.locator(`#txtNetIncome`);
        await expect(monthlyInc).toBeVisible({ timeout: 5000 });
        await monthlyInc.fill(testData().monIncome);
        await page.selectOption(`#ddlPaymentSchedule_new`, { value: "2" });
        await page.locator(`#payday_weekly_1`).click();
        await expect(page.locator(`#btn-Submit`)).toBeVisible({ timeout: 3000 });
        //await page.waitForTimeout(2000);
        await page.locator(`#btn-Submit`).click();
        await filePostingBeforeMiniApp4(request);


        //Miniapp4
        await page.waitForTimeout(2000);
        const agreeCommunication = page.locator("#agree_communication");
        // await expect(agreeCommunication).toBeVisible({timeout:2000});
        await agreeCommunication.click();

        const agreeTelephone = page.locator("#agree_telephone");
        // await expect(agreeTelephone).toBeVisible({timeout:2000});
        await agreeTelephone.click();

        const agreeVerification = page.locator("#agree_verification");
        // await expect(agreeVerification).toBeVisible({timeout:2000});
        await agreeVerification.click();

        const agreePrivacy = page.locator("#agree_privacy");
        // await expect(agreePrivacy).toBeVisible({timeout:2000});
        await agreePrivacy.click();

        const military = page.locator("#id_agree_military_0");
        // await expect(military).toBeVisible({timeout:2000});
        await military.click();

        const agreeArbitration = page.locator("#agree_arbitration");
        // await expect(agreeArbitration).toBeVisible({timeout:2000});
        await agreeArbitration.click();

        const agreeThirdparty = page.locator("#agree_thirdparty");
        // await expect(agreeThirdparty).toBeVisible({timeout:2000});
        await agreeThirdparty.click();
        await page.locator("//span[text()='Confirm and Continue']").click();

        //Offer Page
        await page.waitForLoadState('load')
        await page.locator("(//button[@id='featured_offer'])[2]").click();
        await page.locator("(//button[@class='btn-default btn btn-primary'])[2]").click();

        //BankData Page
        await page.waitForLoadState('load')
        await page.locator("#txtBankRouting").fill(`${testData().routNum}`);
        await page.locator("#txtBankAccount").fill(`${testData().bankNum}`);
        // await page.locator("#online_or_mobile_banking_1").click();
        await filePostingBeforeRePay(request);
        await page.locator("#btn-Submit").click();

        //Repayment Page
        await page.waitForLoadState('load')
        await page.locator("#repayment_method_0").click();
        await page.locator("#repaymentSubmit").click();
        
        //DL-Intermeditate Page
        await page.waitForLoadState('load')
        await page.click(`#btn-Submit`)

        //DL Page
        await page.waitForLoadState('load')
        const frames = page.frames();
        await frames[1].click('#btnNext_dlflow_userdetails')
        await frames[1].getByPlaceholder(`Username`).fill(`decision4`);
        await frames[1].getByPlaceholder(`Password`).fill(`Adf*456`);
        await frames[1].click(`#cb_dl_agreement`);
        await frames[1].click(`#label_info_xsmall_dl_optin`);
        await frames[1].click(`#btnNext_dlflow_banklogin`);

        //Esign Page
        await page.waitForLoadState('load')
        await page.locator("#txtFirstNameTPC").fill(`${testData().firstName}`);
        await page.locator("#txtMiddleNameTPC").fill(`${testData().middleName}`);
        await page.locator("#txtLastNameTPC").fill(`${testData().lastName}`);
        await page.selectOption(`#suffixTPC`, { value: `Sr` });
        const lastdigits = testData().ssnNumber.toString().slice(5, 10);
        console.log(`The last for digits ${lastdigits}`);
        await page.locator("#txtSocialSecurityTPC").fill(`${lastdigits}`);
        await page.locator("(//button[@class='btn btn-large btn-primary'])[1]").click();
        const agreeAuthorization = page.locator("#agree_terms");
        await expect(agreeAuthorization).toBeVisible({ timeout: 2000 });
        await agreeAuthorization.click();

        const agreeTerms = page.locator("//input[@id='agree_authorization_1']");
        await expect(agreeTerms).toBeVisible({ timeout: 2000 });
        await agreeTerms.click();

        const agree_Arbitration = page.locator("#agree_arbitration");
        await expect(agree_Arbitration).toBeVisible({ timeout: 2000 });
        await agree_Arbitration.click();

        const agree_Acknowledgements = page.locator("#agree_acknowledgements");
        await expect(agree_Acknowledgements).toBeVisible({ timeout: 2000 });
        await agree_Acknowledgements.click();

        const agreeEsignature = page.locator("#agree_esignature");
        await expect(agreeEsignature).toBeVisible({ timeout: 2000 });
        await agreeEsignature.click();

        await page.locator("#txtFirstName").fill(`${testData().firstName}`);
        await page.locator("#txtMiddleName").fill(`${testData().middleName}`);
        await page.locator("#txtLastName").fill(`${testData().lastName}`);
        await page.selectOption(`#suffix`, { value: `Sr` });
        const last4digits = testData().ssnNumber.toString().slice(5, 10);
        console.log(`The last for digits ${last4digits}`);
        await page.locator("#txtSocialSecurity").fill(`${last4digits}`);
        await page.locator("(//button[@class='btn btn-large btn-primary'])[2]").click();
        await page.waitForTimeout(2000);

    })
})