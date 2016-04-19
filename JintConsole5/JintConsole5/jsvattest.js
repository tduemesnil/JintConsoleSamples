var total = 0,
    errors = 0;

function checkVATNumber (toCheck) {
 
  // Array holds the regular expressions for the valid VAT number
  var vatexp = new Array();
  
  // To change the default country (e.g. from the UK to Germany - DE):
  //    1.  Change the country code in the defCCode variable below to "DE".
  //    2.  Remove the question mark from the regular expressions associated with the UK VAT number: 
  //        i.e. "(GB)?" -> "(GB)"
  //    3.  Add a question mark into the regular expression associated with Germany's number 
  //        following the country code: i.e. "(DE)" -> "(DE)?"
  
  var defCCode = "DE";
  
  // Note - VAT codes without the "**" in the comment do not have check digit checking.
  vatexp.push (/^(AT)U(\d{8})$/);                           //** Austria
  vatexp.push (/^(BE)(0?\d{9})$/);                          //** Belgium 
  vatexp.push (/^(BG)(\d{9,10})$/);                         //** Bulgaria 
  vatexp.push (/^(CHE)(\d{9})(MWST|TVA|ITA)?$/);            //** Switzerland
  vatexp.push (/^(CY)([0-59]\d{7}[A-Z])$/);                 //** Cyprus
  vatexp.push (/^(CZ)(\d{8,10})(\d{3})?$/);                 //** Czech Republic
  vatexp.push (/^(DE)([1-9]\d{8})$/);                       //** Germany 
  vatexp.push (/^(DK)(\d{8})$/);                            //** Denmark 
  vatexp.push (/^(EE)(10\d{7})$/);                          //** Estonia 
  vatexp.push (/^(EL)(\d{9})$/);                            //** Greece 
  vatexp.push (/^(ES)([A-Z]\d{8})$/);                       //** Spain (National juridical entities)
  vatexp.push (/^(ES)([A-HN-SW]\d{7}[A-J])$/);              //** Spain (Other juridical entities)
  vatexp.push (/^(ES)([0-9YZ]\d{7}[A-Z])$/);                //** Spain (Personal entities type 1)
  vatexp.push (/^(ES)([KLMX]\d{7}[A-Z])$/);                 //** Spain (Personal entities type 2)
  vatexp.push (/^(EU)(\d{9})$/);                            //** EU-type 
  vatexp.push (/^(FI)(\d{8})$/);                            //** Finland 
  vatexp.push (/^(FR)(\d{11})$/);                           //** France (1)
  vatexp.push (/^(FR)([A-HJ-NP-Z]\d{10})$/);                // France (2)
  vatexp.push (/^(FR)(\d[A-HJ-NP-Z]\d{9})$/);               // France (3)
  vatexp.push (/^(FR)([A-HJ-NP-Z]{2}\d{9})$/);              // France (4)
  vatexp.push (/^(GB)?(\d{9})$/);                           //** UK (Standard)
  vatexp.push (/^(GB)?(\d{12})$/);                          //** UK (Branches)
  vatexp.push (/^(GB)?(GD\d{3})$/);                         //** UK (Government)
  vatexp.push (/^(GB)?(HA\d{3})$/);                         //** UK (Health authority)
  vatexp.push (/^(HR)(\d{11})$/);                           //** Croatia 
  vatexp.push (/^(HU)(\d{8})$/);                            //** Hungary 
  vatexp.push (/^(IE)(\d{7}[A-W])$/);                       //** Ireland (1)
  vatexp.push (/^(IE)([7-9][A-Z\*\+)]\d{5}[A-W])$/);        //** Ireland (2)
  vatexp.push (/^(IE)(\d{7}[A-W][AH])$/);                   //** Ireland (3)
  vatexp.push (/^(IT)(\d{11})$/);                           //** Italy 
  vatexp.push (/^(LV)(\d{11})$/);                           //** Latvia 
  vatexp.push (/^(LT)(\d{9}|\d{12})$/);                     //** Lithunia
  vatexp.push (/^(LU)(\d{8})$/);                            //** Luxembourg 
  vatexp.push (/^(MT)([1-9]\d{7})$/);                       //** Malta
  vatexp.push (/^(NL)(\d{9})B\d{2}$/);                      //** Netherlands
  vatexp.push (/^(NO)(\d{9})$/);                            //** Norway (not EU)
  vatexp.push (/^(PL)(\d{10})$/);                           //** Poland
  vatexp.push (/^(PT)(\d{9})$/);                            //** Portugal
  vatexp.push (/^(RO)([1-9]\d{1,9})$/);                     //** Romania
  vatexp.push (/^(RU)(\d{10}|\d{12})$/);                    //** Russia
  vatexp.push (/^(RS)(\d{9})$/);                            //** Serbia
  vatexp.push (/^(SI)([1-9]\d{7})$/);                       //** Slovenia
  vatexp.push (/^(SK)([1-9]\d[2346-9]\d{7})$/);             //** Slovakia Republic
  vatexp.push (/^(SE)(\d{10}01)$/);                         //** Sweden

    // Load up the string to check
    var VATNumber = toCheck.toUpperCase();

    // Remove spaces etc. from the VAT number to help validation
    VATNumber = VATNumber.replace (/(\s|-|\.)+/g, '');

	// Assume we're not going to find a valid VAT number
	var i,
		valid = false,
	    cCode,
		cNumber,
	    oReg;

    // Check the string against the regular expressions for all types of VAT numbers
    for (i = 0; i < vatexp.length; i += 1) {
        oReg = vatexp[i];
        // Have we recognised the VAT number?
        if (oReg.test(VATNumber)) {
            // Yes - we have
            cCode = VATNumber.replace(oReg, '$1');                             // Isolate country code
            cNumber = VATNumber.replace(oReg, '$2');                           // Isolate the number

            if (cCode && cCode.length === 0) {
			    cCode = defCCode;           // Set up default country code
            }
    
            // Call the appropriate country VAT validation routine depending on the country code
            if (eval(cCode + "VATCheckDigit ('" + cNumber + "')")) {
		        valid = VATNumber;
	        }
      
            // Having processed the number, we break from the loop
            break;
        }
    }
  
    // Return with either an error or the reformatted VAT number
    return valid;

}

function DEVATCheckDigit (vatnumber) {
  // Checks the check digits of a German VAT number.
    var i,
        product = 10,
        sum = 0,
        checkdigit = 0;

    for (i = 0; i < 8; i += 1) {
    
        // Extract the next digit and implement peculiar algorithm!.
        sum = (Number(vatnumber.charAt(i)) + product) % 10;
        if (sum === 0) {
		    sum = 10;
	    }
        product = (2 * sum) % 11;
    }
  
	// Establish check digit.  
	if (11 - product === 10) {
        checkdigit = 0;
	} else {
        checkdigit = 11 - product;
	}
  
    // Compare it with the last two characters of the VAT number. If the same, then it is a valid 
    // check digit.
	if (checkdigit.toString() === vatnumber.slice(8, 9)) {
        return true;
    } else {
        return false;
    }
}
                                              // Count of unexpected results found
function testitem (code, expected) {
  //One more VAT number processed
  total++;
  
  // Check the given VAT number
  var result = checkVATNumber (code);
  
  // If the VAT number is valid as expected
  if (result && expected === "valid") {
      print("Correct: " + result +" "  + expected);
  }  
  // If the VAT number was invalid as expected
  else if (!result && expected === "invalid")  { 
    print("Correct: " + code + " " + expected);
  // If the result is unexpected.
  } else {
    errors++;
    print("Incorrect: " + code + " "  + expected + " *** ");
  }
}

print("===== Germany =====");
testitem("DE111111125", "valid");
testitem("DE113298780", "valid");
testitem("DE113891176", "valid");
testitem("DE114189102", "valid");
testitem("DE119429301", "valid");
testitem("DE122119035", "valid");
testitem("DE126639095", "valid");
testitem("DE126823642", "valid");
testitem("DE128575725", "valid");
testitem("DE128936602", "valid");
testitem("DE129516430", "valid");
testitem("DE130502536", "valid");
testitem("DE132507686", "valid");
testitem("DE136695976", "valid");
testitem("DE138263821", "valid");
testitem("DE138497248", "valid");
testitem("DE142930777", "valid");
testitem("DE145141525", "valid");
testitem("DE145146812", "valid");
testitem("DE146624530", "valid");
testitem("DE160459932", "valid");
testitem("DE184543132", "valid");
testitem("DE199085992", "valid");
testitem("DE126563585", "valid");
testitem("DE203159652", "valid");
testitem("DE220709071", "valid");
testitem("DE247139684", "valid");
testitem("DE252429421", "valid");
testitem("DE256319655", "valid");
testitem("DE262044136", "valid");
testitem("DE282741168", "valid");
testitem("DE811209378", "valid");
testitem("DE811363057", "valid");
testitem("DE812321109", "valid");
testitem("DE812529243", "valid");
testitem("DE813030375", "valid");
testitem("DE813189177", "valid");
testitem("DE813232162", "valid");
testitem("DE813261484", "valid");
testitem("DE813495425", "valid");
testitem("DE111111126", "invalid");
testitem("DE111111127", "invalid");
testitem("DE111111128", "invalid");
testitem("DE111111129", "invalid");
testitem("DE111111120", "invalid");
testitem("DE111111121", "invalid");
testitem("DE000000020", "invalid");
testitem("DE000000038", "invalid");
testitem("DE000000046", "invalid");
testitem("DE000000206", "invalid");
testitem("DE000000062", "invalid");
testitem("DE000000079", "invalid");
testitem("DE000000087", "invalid");
testitem("DE000000100", "invalid");
testitem("DE000000118", "invalid");
testitem("DE000000126", "invalid");
testitem("DE000000142", "invalid");
testitem("DE000000159", "invalid");
testitem("DE000000167", "invalid");
testitem("DE000000183", "invalid");
testitem("DE000000191", "invalid");
testitem("DE000000206", "invalid");
print("Total VAT numbers checked: " + total);
print("Total errors found: " + errors);

