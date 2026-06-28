import mysql from 'mysql2';
import { faker } from "@faker-js/faker";
import { APIRequestContext } from "@playwright/test"

let hostName = `test-rds.adfdata.net`
let userName = `autodev`
let pwd = `autodev123`

let templateName: any
let auth = `Basic VEVTVEVSOlRFU1RFUg==`
let lead_id: any
let ip_address: any
let firstName: any
let middleName: any
let lastName: any
let emailAddress: any
let addressLine1: any
let City: any
let phNumber1: any
let phNumber2: any
let ssnNumber: any
let loanAmount: any
let monIncome: any
let routNum: any
let bankNum: any
let transaction_Id: any

const XMLEndpointURL = `http://test-de1.adfdata.net:8866`;
export async function dbConnection(transactionId: any) {
    const connection = mysql.createConnection({
        host: hostName,
        user: userName,
        password: pwd,
        database: ''
    });

    // Function to interact with MySQL
    const fetchFromDatabase = (query: string) => {
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    };
    transaction_Id = transactionId;
    const leadId: any = await fetchFromDatabase(`SELECT leadid FROM personify.transaction_lead_map where transactionid ='${transactionId}';`)
    if (leadId.length >= 0) {
        lead_id = leadId[0].leadid;
    }
    else {
        return null;
    }

    console.log(`The transaction_Id is : ${transactionId}`);
    console.log(`The lead_id is : ${lead_id}`);

    const template_tracker: any = await fetchFromDatabase(`SELECT template_name FROM personify.template_tracker where transactionid='${transactionId}';`)
    if (template_tracker.length >= 0) {
        templateName = template_tracker[0].template_name;
    }
    else {
        return null;
    }

    if (templateName === 'email-success-org.html') {
        await fetchFromDatabase(`update personify.transaction set status='APPLICATIONSTARTED1' where transactionid='${transactionId}';`)
    }
}


export function testDataGenerator() {
    //TestDate
    ip_address = "https://test-ui.adfdata.net/apply"
    firstName = faker.person.firstName().replace(/[^a-zA-Z\s]/g, '');
    middleName = faker.person.middleName().replace(/[^a-zA-Z\s]/g, '');
    lastName = faker.person.lastName().replace(/[^a-zA-Z\s]/g, '');
    emailAddress = `adfautomation.data` + faker.helpers.rangeToNumber({ min: 10000000, max: 99999999 }) + `@gmail.com`;
    addressLine1 = faker.location.streetAddress();
    City = 'LOS ANGELES';
    phNumber1 = faker.phone.number();
    phNumber2 = faker.phone.number();
    ssnNumber = faker.helpers.rangeToNumber({ min: 100000000, max: 999999999 });
    loanAmount = '4,000';
    monIncome = '5,000';
    routNum = '999999963';
    bankNum = faker.helpers.rangeToNumber({ min: 10000000, max: 99999999 });
}

export function testData() {
    return {
        ip_address,
        firstName,
        middleName,
        lastName,
        emailAddress,
        addressLine1,
        City,
        phNumber1,
        phNumber2,
        ssnNumber,
        loanAmount,
        monIncome,
        routNum,
        bankNum
    }

}

export async function filePostingBeforeMiniApp4(request: APIRequestContext) {

    const responseXML = await request.post(`${XMLEndpointURL}/createXml`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },

        data:
        {
            "prodLeadid": null,
            "ssnNumber": `${ssnNumber}`, 
            "xmlToBeUploaded": "CCA,CCR,TU50,TUHARD,TM,CB,MB,FP,LN,IDA,EXP,EQ,DL,FT_FULL,validifi_bank,validifi_risk,validifi_bank_complete,Fraud_consortium",
            "firstName": `${firstName}`, 
            "lastName": `${lastName}`,
            "stateOriginator": "FEB",
            "redflag_agile": "false",
            "dl": {
                "nameEntered": `${firstName} ${lastName}`,
                "nameFound": `${firstName} ${middleName} ${lastName}`, 
                "accountAge": "80",
                "dlData": "DL.xml",
                "transactionDescription": null,
                "institutionName": "Bank of America - Bank",
                "accountNumberFound": `${bankNum}`,
                "accountNumberEntered": `${bankNum}`,
                "accountNumberConfidence": "4",
                "isLogIn": "true",
                "isVerified": "true",
                "paymentFrequency": "Once every two weeks",
                "accountType": "CHECKING",
                "isDLData": "true",
                "pyTag": "",
                "dpTag": "3,5000.0,Derek Mark Draper Sr",
                "ovTag": "",
                "ldTag": "",
                "runningBalDiff": "500",
                "maxDebit": "0",
                "awTag": "1,1500,ATM WITHDRAWAL-POS",
                "statusText": "Login, Verified ",
                "isACHSupported": "true",
                "nameConfidence": "4"
            },
            "tu": {
                "socialSecurity": `${ssnNumber}`,
                "cvScore": "700",
                "vantageScore": "700",
                "deceased": "false",
                "chapter": "false",
                "dateFiled": "",
                "dateReported": "",
                "type": "",
                "hrfacode": "",
                "searchStatus": "",
                "consumerStatementIndicator": "",
                "consumerStatementType": "",
                "badhit": "",
                "nonscorableReason": "",
                "codes": "",
                "tuData": "TUFullCAWithHRFACodes.xml",
                "employerIdentity": "ADF Data Sciences",
                "syntheticModel": "459",
                "removeSyntheticAddonProduct": "false",
                "numberOfTrade": "2",
                "tradeAmount": "400",
                "tuErrorResopnseCode": "",
                "ficoScore": "",
                "lowEndValue": null,
                "highEndValue": null,
                "dob": "",
                "fullName": "",
                "cvR1Code": "022",
                "cvR2Code": "146",
                "cvR3Code": "149",
                "cvR4Code": "137",
                "vantageR1Code": "12",
                "vantageR2Code": "34",
                "vantageR3Code": "32",
                "vantageR4Code": "65",
                "hrfaCodeActiveDuty": null,
                "addressMisMatch": false,
                "tuaddress": `${addressLine1}`,
                "tuStateCode": "FL",
                "tuZipCode": "32003",
                "suppressed": null,
                "minor": null,
                "hrfaCodeMinor": null,
                "hrfaCodeIEFraud": null,
                "hrfaCodeDeceased": null,
                "activeMilitary": null,
                "freezeIndicator": null,
                "freezeType": null,
                "fileHitIndicator": null,
                "addressMatch": null,
                "iefraudText": null,
                "iefraudType": null
            },
            "tuhard": {
                "socialSecurity": `${ssnNumber}`,
                "cvScore": "700",
                "vantageScore": "700",
                "deceased": "false",
                "chapter": "false",
                "dateFiled": "",
                "dateReported": "",
                "type": "",
                "hrfacode": "",
                "searchStatus": "",
                "consumerStatementIndicator": "",
                "consumerStatementType": "",
                "badhit": "",
                "nonscorableReason": "",
                "codes": "",
                "tuData": "tuhardcomplete.xml",
                "employerIdentity": "ADF Data Sciences",
                "syntheticModel": "459",
                "removeSyntheticAddonProduct": "false",
                "numberOfTrade": "2",
                "tradeAmount": "400",
                "tuErrorResopnseCode": "",
                "ficoScore": "700",
                "lowEndValue": "60000",
                "highEndValue": "60000",
                "dob": "",
                "fullName": "",
                "cvR1Code": "022",
                "cvR2Code": "146",
                "cvR3Code": "149",
                "cvR4Code": "137",
                "vantageR1Code": "12",
                "vantageR2Code": "34",
                "vantageR3Code": "32",
                "vantageR4Code": "65",
                "hrfaCodeActiveDuty": null,
                "addressMisMatch": false,
                "tuaddress": `${addressLine1}`,
                "tuStateCode": "FL",
                "tuZipCode": "32003",
                "suppressed": null,
                "minor": null,
                "hrfaCodeMinor": null,
                "hrfaCodeIEFraud": null,
                "hrfaCodeDeceased": null,
                "activeMilitary": null,
                "freezeIndicator": null,
                "freezeType": null,
                "fileHitIndicator": null,
                "addressMatch": null,
                "iefraudText": null,
                "iefraudType": null
            },
            "tm": {
                "tmData": "TM.txt",
                "deviceId": "hra5e35n7fpr8sa6nsmk4ln495",
                "policyScore": "5",
                "tmStatus": "pass",
                "policy": "NPS_Policy_1",
                "tmGeoMatch": "Florida"
            },
            "clcf": null,
            "clcb": {
                "cbbScore": "682",
                "cbbScore2": "682",
                "cbbScorenil": null,
                "cbbScore2nil": null,
                "clcbData": "CLCB.xml",
                "clarityUnpaidAccountClosuresLast60Day": "nil",
                "clarityUnpaidAccountClosuresLast3Year": "nil",
                "clarityUnpaidAccountClosuresLast5Year": "nil",
                "clarityNumberOfPaydaySixtyDaysAgo": "7",
                "fileNameFormat": "FEB_CB.xml",
                "deceased": "false",
                "activeMilitary": false,
                "ofac_cbb": "false",
                "deceased_cbb": "false",
                "nonScorableCode_cbb": "10",
                "identityTheft": "null",
                "consumerPrivacyText": "null",
                "consumerStatementText1": "null",
                "consumerStatementText2": "null",
                "consumerStatementText3": "null",
                "clarityAccountSSNcount": "0",
                "clarityFraudHistory": "0",
                "clarityAccountPrimary": "TRUE",
                "clarityEstimatedBankHistory": "30",
                "clarityCbbReasonCode": null,
                "clarityDefaultHistory": "0",
                "clarityAccountSSNcountMICR": "2",
                "clarityAccountriskfactors2": "0",
                "clarityBankAccountDefaultHistory": "FALSE",
                "countofcheckscashedninetydaysago": "5",
                "countofchecksattemptedninetydaysago": "7"
            },
            "ida": {
                "idaData": "idaxml.xml",
                "idaScore": "675",
                "idaAddressLinkedToPrimaryPhoneLastYear": "1.0",
                "idaLikelyAgeAtSSNIssuance": "30",
                "idaNumEventsForAddrSameName3Months": "20",
                "idaTimesAppliedByNameDOB30Days": "10",
                "idaTimesAppliedByNameDOB3Months": "20",
                "idaTimesAppliedByAddr6Months": "50",
                "ssnassocWithDiffName": "false",
                "ssnassocWithDiffDOB": "false",
                "ssndobaddrConfirmed": "true",
                "numDOBLinkSSN30Days": "1"
            },
            "mb": {
                "mbData": "MB.xml"
            },
            "fp": {
                "fpData": "fraudPoint.xml",
                "fpScoreValue": "699",
                "fpStolenIdentityIndex": "5",
                "fpSyntheticIdentityIndex": "5",
                "fpVulnerableVictimIndex": "2",
                "fpFriendlyFraudIndex": "1",
                "fpSuspiciousActivityIndex": "5",
                "fpManipulatedIdentityIndex": "4",
                "fileNameFormat": null
            },
            "ln": {
                "lnData": "LN.xml",
                "shortTermLendingScore": "570",
                "alertCode": "600",
                "alertRegulatoryConditionValue": "1",
                "subjectDeceased": "0",
                "addrOnFileHighRisk": "0",
                "subjectAge": "18",
                "additionalAlert": "",
                "additionalAlertCode": "600A",
                "bankruptcyChapter": "",
                "bankruptcyStatus": "",
                "bankruptcyTimeNewest": "",
                "ssnDeceased": "0"
            },
            "eq": {
                "eqData": "Equifax.xml",
                "employerName": "",
                "ssnNumber": `${ssnNumber}`,
                "firstName": `${firstName}`,
                "lastName": `${lastName}`, 
                "employerStatusCode": "5",
                "tsvTotalAmount": "77000",
                "tsvPayFrequency": "",
                "equifaxRequired": "YES",
                "totalLengthOfSVC": "",
                "dtEndDate": "",
                "disclaimer": "",
                "tsvPayFrequencyCode": "",
                "tsvProjIncome": "12000000"
            },
            "exp": {
                "expData": "Experian.xml",
                "firstName": `${firstName}`,
                "lastName": `${lastName}`,
                "fullName": `${firstName},${lastName}`,
                "socialSecurityNumber": `${ssnNumber}`,
                "totalAnnualRemunerationAmount": null,
                "asOfdate": null,
                "paydate": null
            },
            "idology": null,
            "lnEnquiryResponse": null,
            "clarityInquiryResponseXML": null,
            "lnIntegrityResponxeXML": null,
            "clarityHistoryResponse": null,
            "ccfXML": null,
            "ccaXML": null,
            "tu50XML": {
                "tu50Data": "TUFullCAWithHRFACodes.xml",
                "vantageScore": "700"
            },
            "validifi": {
                "requestId": "60631493",
                "validifiBankStatus": "14",
                "validifiBankCompleteStatus": "15",
                "bavaccountconfirmity": "",
                "statuscodepresent": "yes",
                "nostatuscodemessage": "17220|Your company has requested this record be filtered",
                "statuscodes": "1",
                "bavabvlookup": ""
            },
            "ft_Full": {
                "consumerStatementsIndicator": "false"
            },
            "neuro_id_scores": null,
            "neuro_id_attributes": null,
            "neuro_id_orchestrator": null,
            "dlrefresh": null,
            "fraud_consortium": {
                "socialSecurityNumber": `${ssnNumber}`,
                "session_id": "6ed38b7c-a310-47c8-9351-ca1298afcf7b",
                "resultset": "1",
                "extendedDeviceRisk": "Low",
                "isagelow": "false",
                "final_caseid": `6ed38b7c-a310-47c8-9351-ca1298afcf7b|8b8734fd-3262-4544-b292-53e897c6a252${ssnNumber}`
            },
            "tuTruValidate": null,
            "lnDdpEmailAge": null,
            "lnDdpFraudIntelSuite": null,
            "lnDdpInstantID": null,
            "lnDdpPhoneFinderPii": null,
            "leadid": `${lead_id}`,
            "cca": {
                "activeDuty": "0",
                "baseXml": "CCAXML.xml",
                "clarityNumberOfEmployersLastSixMonths": "3",
                "clarityWorkPhonestability": "5",
                "clarityEmailStability": "4",
                "clarityBankAccountEmailCOunt": "4",
                "clarityLoanAmount24HoursAgo": "1200",
                "clarityAmountOfLoanChargedOffNinetyDaysAgo": "1800",
                "clatityDaySinceFirstOnTimePayment": "6",
                "clarityNoOfLoanLast15Days": "7",
                "fileNameFormat": "FEB_CF.xml",
                "deceased": "false",
                "activeMilitary": false,
                "ofac_cca": "false",
                "deceased_cca": "false",
                "experianActiveDutyAlert_cca": "null",
                "initialAlert": "null",
                "claritySSNDOBMatch": "match",
                "clarityOFAC": "FALSE"
            },
            "ccr": {
                "deceased": "false",
                "activeDuty": "0",
                "baseXml": "CCRXML.xml",
                "clarityNumberOfEmployersLastSixMonths": "3",
                "clarityWorkPhonestability": "5",
                "clarityEmailStability": "4",
                "clarityBankAccountEmailCOunt": "4",
                "clarityLoanAmount24HoursAgo": "1200",
                "clarityAmountOfLoanChargedOffNinetyDaysAgo": "1800",
                "clatityDaySinceFirstOnTimePayment": "6",
                "clarityNoOfLoanLast15Days": "7",
                "ccrexperianActiveDutyAlert": "null",
                "ccrdeceased": "false",
                "activeMilitary": "false",
                "ofac_ccr": "false",
                "initialAlert": "null",
                "extendedAlert": "null",
                "claritySSNDOBMatch": "match",
                "clarityOFAC": "FALSE",
                "ccrscore": "634"
            }
        }
    })
    console.log(`${responseXML.status()}--${responseXML.statusText()}`);

    const responseModel = await request.post(`${XMLEndpointURL}/createModel`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        data:
        {
            "ssnNumber": `${ssnNumber}`,
            "modelToBeUploaded": "TUCLRTJ,OFFERDROP_MDL,AE_OFFERDROP_MDL,RISK_MDL,PTIDTI,DL_CONV_MDL,INCOME_MDL,RC,CCR,TULNCCR",
            "incomeModelRequest": "{\"adjusted_income\":\"500000\",\"transactiondate\":\"2025-04-01T18:55:33\"}",
            "riskModel": {
                "tumb_v1": "0",
                "tu_v1_2_0": "0",
                "tu_v1_2_1": "900",
                "tu_v1_2_2": "850",
                "model_1": "999",
                "model_2": "999",
                "ensmbl_V1_score": "946"
            },
            "tuclRTJson": {
                "tuclVersionName": "tucl_rt_v9_0_score",
                "tuclScore": "819",
                "loanOfferList30PerCent": "[{\"loan_amount\":3000,\"apr\":59.5,\"term\":36,\"tucl_score\":900},{\"loan_amount\":3500,\"apr\":59.5,\"term\":36,\"tucl_score\":900},{\"loan_amount\":4000,\"apr\":59.5,\"term\":36,\"tucl_score\":900},{\"loan_amount\":4500,\"apr\":59.5,\"term\":36,\"tucl_score\":900},{\"loan_amount\":3000,\"apr\":98.5,\"term\":36,\"tucl_score\":855},{\"loan_amount\":3500,\"apr\":98.5,\"term\":36,\"tucl_score\":855},{\"loan_amount\":4000,\"apr\":98.5,\"term\":36,\"tucl_score\":855},{\"loan_amount\":4500,\"apr\":98.5,\"term\":36,\"tucl_score\":855},{\"loan_amount\":3000,\"apr\":159.0,\"term\":36,\"tucl_score\":900},{\"loan_amount\":3500,\"apr\":159.0,\"term\":36,\"tucl_score\":850},{\"loan_amount\":4000,\"apr\":159.0,\"term\":36,\"tucl_score\":850},{\"loan_amount\":4500,\"apr\":159.0,\"term\":36,\"tucl_score\":850}]",
                "proxy_other_lenders_payment_obligation_v1": "1500"
            },
            "rcModel": {
                "rccutOff": "880"
            },
            "offer_drop_mdl": `{\"leadid\":\`${lead_id}\`,\"rt_offerdrop_model_v1_0_score\":\"559\"}`,
            "dlConversionModel": `{\"leadid\":\`${lead_id}\`,\"dl_model_v1_0_score\":700}`,
            "ccrmodelJSONResponse": `{\"CCR_v8_0_score\":\"521\",\"leadid\":\`${lead_id}\`}`,
            "tulnccrmodelJSONResponse": `{\"TULNCCR_v8_0_score\":\"720\",\"leadid\":\`${lead_id}\`}`,
            "ptidtiModel": `{\"other_lenders_payment_obligation_v1\":\"1000\",\"other_lenders_debt_obligation_v1\":\"0\"}`,
            "ae_offer_drop_mdl": "{}",
            "leadid": `${lead_id}`
        }
    })
    console.log(`${responseModel.status()}--${responseModel.statusText()}`);

    const responseUniPSM = await request.post(`${XMLEndpointURL}/createUnifiedPSM`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        data:
        {
            "leadID": `${lead_id}`,
            "channel": "ORG",
            "stages": [
                "TUCL_RT"
            ],
            "psm_V10_0_scores": [
                "740.0"
            ]
        }
    })
    console.log(`${responseUniPSM.status()}--${responseUniPSM.statusText()}`);

    const responseUnifedPSM = await request.post(`${XMLEndpointURL}/createUnifiedPSM`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        data:
        {
            "leadID": `${lead_id}`,
            "channel": "ORG",
            "stages": [
                "PREDL"
            ],
            "psm_V10_0_scores": [
                "999.0"
            ]
        }
    })
    console.log(`${responseUnifedPSM.status()}--${responseUnifedPSM.statusText()}`);
}


export async function filePostingBeforeRePay(request: APIRequestContext) {

    const respxml = await request.post(`${XMLEndpointURL}/createXml`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        data:
        {
            "prodLeadid": null,
            "ssnNumber": `${ssnNumber}`,
            "xmlToBeUploaded": "TUHARD,TM,CCA,CB,MB,FP,LN,IDA,EXP,EQ,DL,FT_FULL,validifi_bank,validifi_risk,Neuro_id_orchestrator,Neuro_id_attributes,TUTruValidate,Fraud_consortium,LNDDPEmailAge,LNDDPFraudIntelSuite,LNDDPInstantID",
            "firstName": `${firstName}`,
            "lastName": `${lastName}`,
            "stateOriginator": "FEB",
            "redflag_agile": "false",
            "dl": {
                "nameEntered": `${firstName} ${lastName}`,
                "nameFound": `${firstName} ${middleName} ${lastName}`,
                "accountAge": "80",
                "dlData": "DL.xml",
                "transactionDescription": null,
                "institutionName": "Bank of America - Bank",
                "accountNumberFound": `${bankNum}`,
                "accountNumberEntered": `${bankNum}`,
                "accountNumberConfidence": "4",
                "isLogIn": "true",
                "isVerified": "true",
                "paymentFrequency": "Once every two weeks",
                "accountType": "CHECKING",
                "isDLData": "true",
                "pyTag": "1,5500.02,ADF Data Sciences",
                "dpTag": "",
                "ovTag": "",
                "ldTag": "",
                "runningBalDiff": "500",
                "maxDebit": "0",
                "awTag": "1,1500,ATM WITHDRAWAL-POS",
                "statusText": "Login, Verified ",
                "isACHSupported": "true",
                "nameConfidence": "4"
            },
            "tu": {
                "socialSecurity": `${ssnNumber}`,
                "cvScore": "700",
                "vantageScore": "700",
                "deceased": "false",
                "chapter": "false",
                "dateFiled": "",
                "dateReported": "",
                "type": "",
                "hrfacode": "",
                "searchStatus": "",
                "consumerStatementIndicator": "",
                "consumerStatementType": "",
                "badhit": "",
                "nonscorableReason": "",
                "codes": "",
                "tuData": "TUFullCAWithHRFACodes.xml",
                "employerIdentity": "ADF Data Sciences",
                "syntheticModel": "459",
                "removeSyntheticAddonProduct": "false",
                "numberOfTrade": "2",
                "tradeAmount": "400",
                "tuErrorResopnseCode": "",
                "ficoScore": "",
                "lowEndValue": null,
                "highEndValue": null,
                "dob": "",
                "fullName": "",
                "cvR1Code": "022",
                "cvR2Code": "146",
                "cvR3Code": "149",
                "cvR4Code": "137",
                "vantageR1Code": "12",
                "vantageR2Code": "34",
                "vantageR3Code": "32",
                "vantageR4Code": "65",
                "hrfaCodeActiveDuty": null,
                "addressMisMatch": false,
                "tuaddress": `${addressLine1}`,
                "tuStateCode": "FL",
                "tuZipCode": "32003",
                "suppressed": null,
                "minor": null,
                "hrfaCodeMinor": null,
                "hrfaCodeIEFraud": null,
                "hrfaCodeDeceased": null,
                "activeMilitary": null,
                "freezeIndicator": null,
                "freezeType": null,
                "fileHitIndicator": null,
                "addressMatch": null,
                "iefraudText": null,
                "iefraudType": null
            },
            "tuhard": {
                "socialSecurity": `${ssnNumber}`,
                "cvScore": "700",
                "vantageScore": "700",
                "deceased": "false",
                "chapter": "false",
                "dateFiled": "",
                "dateReported": "",
                "type": "",
                "hrfacode": "",
                "searchStatus": "",
                "consumerStatementIndicator": "",
                "consumerStatementType": "",
                "badhit": "",
                "nonscorableReason": "",
                "codes": "",
                "tuData": "tuhardcomplete.xml",
                "employerIdentity": "ADF Data Sciences",
                "syntheticModel": "459",
                "removeSyntheticAddonProduct": "false",
                "numberOfTrade": "2",
                "tradeAmount": "400",
                "tuErrorResopnseCode": "",
                "ficoScore": "700",
                "lowEndValue": "27560.54485723008",
                "highEndValue": "27560.54485723008",
                "dob": "",
                "fullName": "",
                "cvR1Code": "022",
                "cvR2Code": "146",
                "cvR3Code": "149",
                "cvR4Code": "137",
                "vantageR1Code": "12",
                "vantageR2Code": "34",
                "vantageR3Code": "32",
                "vantageR4Code": "65",
                "hrfaCodeActiveDuty": null,
                "addressMisMatch": false,
                "tuaddress": `${addressLine1}`,
                "tuStateCode": "FL",
                "tuZipCode": "32003",
                "suppressed": null,
                "minor": null,
                "hrfaCodeMinor": null,
                "hrfaCodeIEFraud": null,
                "hrfaCodeDeceased": null,
                "activeMilitary": null,
                "freezeIndicator": null,
                "freezeType": null,
                "fileHitIndicator": null,
                "addressMatch": null,
                "iefraudText": null,
                "iefraudType": null
            },
            "tm": {
                "tmData": "TM.txt",
                "deviceId": "hra5e35n7fpr8sa6nsmk4ln495",
                "policyScore": "5",
                "tmStatus": "pass",
                "policy": "NPS_Policy_1",
                "tmGeoMatch": "Florida"
            },
            "clcf": null,
            "clcb": {
                "cbbScore": "682",
                "cbbScore2": "682",
                "cbbScorenil": null,
                "cbbScore2nil": null,
                "clcbData": "CLCB.xml",
                "clarityUnpaidAccountClosuresLast60Day": "nil",
                "clarityUnpaidAccountClosuresLast3Year": "nil",
                "clarityUnpaidAccountClosuresLast5Year": "nil",
                "clarityNumberOfPaydaySixtyDaysAgo": "7",
                "fileNameFormat": "FEB_CB.xml",
                "deceased": "false",
                "activeMilitary": false,
                "ofac_cbb": "false",
                "deceased_cbb": "false",
                "nonScorableCode_cbb": "10",
                "identityTheft": "null",
                "consumerPrivacyText": "null",
                "consumerStatementText1": "null",
                "consumerStatementText2": "null",
                "consumerStatementText3": "null",
                "clarityAccountSSNcount": "0",
                "clarityFraudHistory": "0",
                "clarityAccountPrimary": "TRUE",
                "clarityEstimatedBankHistory": "30",
                "clarityCbbReasonCode": null,
                "clarityDefaultHistory": "0",
                "clarityAccountSSNcountMICR": "2",
                "clarityAccountriskfactors2": "0",
                "clarityBankAccountDefaultHistory": "FALSE",
                "countofcheckscashedninetydaysago": "5",
                "countofchecksattemptedninetydaysago": "7"
            },
            "ida": {
                "idaData": "idaxml.xml",
                "idaScore": "675",
                "idaAddressLinkedToPrimaryPhoneLastYear": "1.0",
                "idaLikelyAgeAtSSNIssuance": "30",
                "idaNumEventsForAddrSameName3Months": "20",
                "idaTimesAppliedByNameDOB30Days": "10",
                "idaTimesAppliedByNameDOB3Months": "20",
                "idaTimesAppliedByAddr6Months": "50",
                "ssnassocWithDiffName": "false",
                "ssnassocWithDiffDOB": "false",
                "ssndobaddrConfirmed": "true",
                "numDOBLinkSSN30Days": "1"
            },
            "mb": {
                "mbData": "MB.xml"
            },
            "fp": {
                "fpData": "fraudPoint.xml",
                "fpScoreValue": "699",
                "fpStolenIdentityIndex": "5",
                "fpSyntheticIdentityIndex": "5",
                "fpVulnerableVictimIndex": "2",
                "fpFriendlyFraudIndex": "1",
                "fpSuspiciousActivityIndex": "5",
                "fpManipulatedIdentityIndex": "4",
                "fileNameFormat": null
            },
            "ln": {
                "lnData": "LN.xml",
                "shortTermLendingScore": "570",
                "alertCode": "600",
                "alertRegulatoryConditionValue": "1",
                "subjectDeceased": "0",
                "addrOnFileHighRisk": "0",
                "subjectAge": "18",
                "additionalAlert": "",
                "additionalAlertCode": "600A",
                "bankruptcyChapter": "",
                "bankruptcyStatus": "",
                "bankruptcyTimeNewest": "",
                "ssnDeceased": "0"
            },
            "eq": {
                "eqData": "Equifax.xml",
                "employerName": "ADF Data Sciences",
                "ssnNumber": `${ssnNumber}`,
                "firstName": `${firstName}`,
                "lastName": `${lastName}`,
                "employerStatusCode": "5",
                "tsvTotalAmount": "11483.746",
                "tsvPayFrequency": "",
                "equifaxRequired": "YES",
                "totalLengthOfSVC": "2",
                "dtEndDate": "",
                "disclaimer": "",
                "tsvPayFrequencyCode": "",
                "tsvProjIncome": "12000000"
            },
            "exp": {
                "expData": "Experian.xml",
                "firstName": `${firstName}`,
                "lastName": `${lastName}`,
                "fullName": `${firstName},${lastName}`,
                "socialSecurityNumber": `${ssnNumber}`,
                "totalAnnualRemunerationAmount": "3544.82",
                "asOfdate": "03302025",
                "paydate": "03302025"
            },
            "idology": null,
            "lnEnquiryResponse": null,
            "clarityInquiryResponseXML": null,
            "lnIntegrityResponxeXML": null,
            "clarityHistoryResponse": null,
            "ccfXML": null,
            "ccaXML": null,
            "tu50XML": null,
            "validifi": {
                "requestId": "60631496",
                "validifiBankStatus": "14",
                "validifiBankCompleteStatus": "15",
                "bavaccountconfirmity": "",
                "statuscodepresent": "yes",
                "nostatuscodemessage": "17220|Your company has requested this record be filtered",
                "statuscodes": "1",
                "bavabvlookup": ""
            },
            "ft_Full": {
                "consumerStatementsIndicator": "false"
            },
            "neuro_id_scores": null,
            "neuro_id_attributes": {
                "transaction_id": `${transaction_Id}`
            },
            "neuro_id_orchestrator": {
                "transaction_id": `${transaction_Id}`,
                "nuroOrchestrator_riskDevice": "false"
            },
            "dlrefresh": null,
            "fraud_consortium": {
                "socialSecurityNumber": `${ssnNumber}`,
                "session_id": "6ed38b7c-a310-47c8-9351-ca1298afcf7b",
                "resultset": "1",
                "extendedDeviceRisk": "Low",
                "isagelow": "false",
                "final_caseid": `6ed38b7c-a310-47c8-9351-ca1298afcf7b|ec209392-a636-477f-a8bc-ad4f39acae0e${ssnNumber}`
            },
            "tuTruValidate": {
                "phones": [
                    `${phNumber1}`,
                    `${phNumber2}`
                ],
                "correlationId": "60631496",
                "address": {
                    "streetAddress": `${addressLine1}`,
                    "city": `${City}`,
                    "state": "FL",
                    "postal": "32003"
                },
                "phoneToName": "1",
                "emailToName": "1",
                "indicatorsRisk": "Low",
                "emailFound": "1",
                "addresstoName": null
            },
            "lnDdpEmailAge": {
                "socialSecurityNumber": `${ssnNumber}`,
                "streetAddress": `${addressLine1}`,
                "city": `${City}`,
                "state": "FL",
                "postal": "32003",
                "emailExists": "Yes",
                "firstSeenDays": "1",
                "eaAdvice": "No",
                "eaRiskBandId": "2",
                "fraudType": "Null"
            },
            "lnDdpFraudIntelSuite": {
                "socialSecurityNumber": `${ssnNumber}`,
                "streetAddress": `${addressLine1}`,
                "city": `${City}`,
                "state": "FL",
                "postal": "32003",
                "fiScore1": "0",
                "fiScore2": "0",
                "fiScore3": "0"
            },
            "lnDdpInstantID": {
                "socialSecurityNumber": `${ssnNumber}`,
                "streetAddress": `${addressLine1}`,
                "city": `${City}`,
                "state": "FL",
                "postal": "32003",
                "cvi": "21",
                "dobMatchLevel": "8"
            },
            "lnDdpPhoneFinderPii": null,
            "leadid": `${lead_id}`,
            "cca": {
                "activeDuty": "0",
                "baseXml": "CCAXML.xml",
                "clarityNumberOfEmployersLastSixMonths": "3",
                "clarityWorkPhonestability": "5",
                "clarityEmailStability": "4",
                "clarityBankAccountEmailCOunt": "4",
                "clarityLoanAmount24HoursAgo": "1200",
                "clarityAmountOfLoanChargedOffNinetyDaysAgo": "1800",
                "clatityDaySinceFirstOnTimePayment": "6",
                "clarityNoOfLoanLast15Days": "7",
                "fileNameFormat": "FEB_CF.xml",
                "deceased": "false",
                "activeMilitary": false,
                "ofac_cca": "false",
                "deceased_cca": "false",
                "experianActiveDutyAlert_cca": "null",
                "initialAlert": "null",
                "claritySSNDOBMatch": "match",
                "clarityOFAC": "FALSE"
            },
            "ccr": null
        }

    })
    console.log(`${respxml.status()}--${respxml.statusText()}`)

    const responseModel = await request.post(`${XMLEndpointURL}/createModel`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        data:
        {
            "ssnNumber": `${ssnNumber}`,
            "modelToBeUploaded": "PSM_PREDL,INCOME_MDL,PTIDTI",
            "incomeModelRequest": "{\"adjusted_income\":\"27559.56485723008\",\"transactiondate\":\"2025-04-01T18:58:21\"}",
            "ptidtiModel": "{\"other_lenders_payment_obligation_v1\":\"1000\",\"other_lenders_debt_obligation_v1\":\"0\"}",
            "leadid": `${lead_id}`
        }
    })
    console.log(`${responseModel.status()}--${responseModel.statusText()}`);

    const responsePSM = await request.post(`${XMLEndpointURL}/createPsm`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        data:
        {
            "leadid": `${lead_id}`,
            "PSM20_withoutDL_V7_1_nonps_score": "1000",
            "PSM20_withoutDL_V8_1_nonps_score": "1000",
            "PSM20_withoutDL_V7_1_ps_score": "1000",
            "PSM21_V8_1_score": "1000",
            "PSM20_withoutDL_V7_1_1_nonps_score": "1000",
            "fraud_model_V2_0_1_score": "1000",
            "fraud_model_V1_0_1_score": "1000",
            "fraud_model_withoutDL_V1_0_1_score": "1000",
            "fraud_model_V2_1_score": "1000",
            "Refi_predict_model_V1_0_score": "1000",
            "PSM21_V8_2_score": "1000",
            "PSM_withoutDL_V8_0_score": "1000",
            "PSM_V8_0_score": "1000",
            "PSM_withoutDL_V9_0_score": "1000",
            "PSM_V9_0_score": "1000",
            "fraud_model_V3_0_score": "2",
            "fraud_model_V4_0_score": "90",
            "fraud_model_V4_1_score": "700",
            "fraud_model_v5_residual_score": "0.18",
            "anomaly_detection_model_v1_score": "700",
            "ShortTerm_Risk_V1_0_score": "1000"
        }
    })
    console.log(`${responsePSM.status()}--${responsePSM.statusText()}`);

    const responseUnifedPSM = await request.post(`${XMLEndpointURL}/createUnifiedPSM`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        data:
        {
            "leadID": `${lead_id}`,
            "channel": "ORG",
            "stages": [
                "POSTDL"
            ],
            "psm_V10_0_scores": [
                "999.0"
            ]
        }
    })
    console.log(`${responseUnifedPSM.status()}--${responseUnifedPSM.statusText()}`);

    const responselnOTP = await request.post(`${XMLEndpointURL}/createUnifiedPSM`, {
        headers:
        {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        data:
        {
            "get_phones_response": {
                "SSN": `${ssnNumber}`,
                "OtherPhone": `${phNumber2}`,
                "PrimaryPhone": `${phNumber1}`,
                "ConversationId": "938813",
                "requestid": "1272",
                "TransactionStatus": "passed"
            },
            "verify_otp_response": {
                "ConversationId": "938813",
                "requestid": "1272",
                "TransactionStatus": "passed"
            },
            "send_otp_response": {
                "SSN": `${ssnNumber}`,
                "ConversationId": "938813",
                "requestid": "1272",
                "TransactionStatus": "passed"
            },
            "ln_ddp_phone_finder_pii_response": {
                "SSN": `${ssnNumber}`,
                "PrimaryPhone": `${phNumber1}`,
                "OtherPhone": `${phNumber2}`,
                "inputRequestID": "86298ccb-cd15-43d7-af04-1442c6fe2e63",
                "authStatus": "passed"
            },
            "ln_ddp_send_otp_response": {
                "SSN": `${ssnNumber}`,
                "inputRequestID": "86298ccb-cd15-43d7-af04-1442c6fe2e63",
                "authStatus": "authentication_in_progress"
            },
            "ln_ddp_verify_otp_response": {
                "inputRequestID": "86298ccb-cd15-43d7-af04-1442c6fe2e63",
                "authStatus": "authentication_success"
            },
            "get_quiz_questions": {
                "SSN": `${ssnNumber}`,
                "TransactionStatus": "pending",
                "ConversationId": "938813"
            },
            "get_quiz_answers": {
                "ConversationId": "938813",
                "TransactionStatus": "passed"
            },
            "get_marginal_question": {
                "SSN": `${ssnNumber}`,
                "ConversationId": "938813",
                "TransactionStatus": "pending"
            },
            "get_marginal_answer": {
                "ConversationId": "938813",
                "TransactionStatus": "passed"
            },
            "idology": {
                "idNumber": `${ssnNumber}`,
                "status": "Pass"
            }
        }
    })
    console.log(`${responselnOTP.status()}--${responselnOTP.statusText()}`);

}