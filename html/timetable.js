function HashSet(param1, param2) {
	var hashTable = new Hashtable(param1, param2);

	this.add = function(o) {
		hashTable.put(o, true);
	};

	this.addAll = function(arr) {
		for (var i = 0, len = arr.length; i < len; ++i) {
			hashTable.put(arr[i], true);
		}
	};

	this.values = function() {
		return hashTable.keys();
	};

	this.remove = function(o) {
		return hashTable.remove(o) ? o : null;
	};

	this.contains = function(o) {
		return hashTable.containsKey(o);
	};

	this.clear = function() {
		hashTable.clear();
	};

	this.size = function() {
		return hashTable.size();
	};

	this.isEmpty = function() {
		return hashTable.isEmpty();
	};

	this.clone = function() {
		var h = new HashSet(param1, param2);
		h.addAll(hashTable.keys());
		return h;
	};

	this.intersection = function(hashSet) {
		var intersection = new HashSet(param1, param2);
		var values = hashSet.values(), i = values.length, val;
		while (i--) {
			val = values[i];
			if (hashTable.containsKey(val)) {
				intersection.add(val);
			}
		}
		return intersection;
	};

	this.union = function(hashSet) {
		var union = this.clone();
		var values = hashSet.values(), i = values.length, val;
		while (i--) {
			val = values[i];
			if (!hashTable.containsKey(val)) {
				union.add(val);
			}
		}
		return union;
	};

	this.isSubsetOf = function(hashSet) {
		var values = hashTable.keys(), i = values.length;
		while (i--) {
			if (!hashSet.contains(values[i])) {
				return false;
			}
		}
		return true;
	};

	this.complement = function(hashSet) {
		var complement = new HashSet(param1, param2);
		var values = this.values(), i = values.length, val;
		while (i--) {
			val = values[i];
			if (!hashSet.contains(val)) {
				complement.add(val);
			}
		}
		return complement;
	};
}

var Hashtable = (function(UNDEFINED) {
	var FUNCTION = "function", STRING = "string", UNDEF = "undefined";

	// Require Array.prototype.splice, Object.prototype.hasOwnProperty and encodeURIComponent. In environments not
	// having these (e.g. IE <= 5), we bail out now and leave Hashtable null.
	if (typeof encodeURIComponent == UNDEF ||
		Array.prototype.splice === UNDEFINED ||
		Object.prototype.hasOwnProperty === UNDEFINED) {
		return null;
	}

	function toStr(obj) {
		return (typeof obj == STRING) ? obj : "" + obj;
	}

	function hashObject(obj) {
		var hashCode;
		if (typeof obj == STRING) {
			return obj;
		} else if (typeof obj.hashCode == FUNCTION) {
			// Check the hashCode method really has returned a string
			hashCode = obj.hashCode();
			return (typeof hashCode == STRING) ? hashCode : hashObject(hashCode);
		} else {
			return toStr(obj);
		}
	}

	function merge(o1, o2) {
		for (var i in o2) {
			if (o2.hasOwnProperty(i)) {
				o1[i] = o2[i];
			}
		}
	}

	function equals_fixedValueHasEquals(fixedValue, variableValue) {
		return fixedValue.equals(variableValue);
	}

	function equals_fixedValueNoEquals(fixedValue, variableValue) {
		return (typeof variableValue.equals == FUNCTION) ?
			variableValue.equals(fixedValue) : (fixedValue === variableValue);
	}

	function createKeyValCheck(kvStr) {
		return function(kv) {
			if (kv === null) {
				throw new Error("null is not a valid " + kvStr);
			} else if (kv === UNDEFINED) {
				throw new Error(kvStr + " must not be undefined");
			}
		};
	}

	var checkKey = createKeyValCheck("key"), checkValue = createKeyValCheck("value");

	/*----------------------------------------------------------------------------------------------------------------*/

	function Bucket(hash, firstKey, firstValue, equalityFunction) {
		this[0] = hash;
		this.entries = [];
		this.addEntry(firstKey, firstValue);

		if (equalityFunction !== null) {
			this.getEqualityFunction = function() {
				return equalityFunction;
			};
		}
	}

	var EXISTENCE = 0, ENTRY = 1, ENTRY_INDEX_AND_VALUE = 2;

	function createBucketSearcher(mode) {
		return function(key) {
			var i = this.entries.length, entry, equals = this.getEqualityFunction(key);
			while (i--) {
				entry = this.entries[i];
				if ( equals(key, entry[0]) ) {
					switch (mode) {
						case EXISTENCE:
							return true;
						case ENTRY:
							return entry;
						case ENTRY_INDEX_AND_VALUE:
							return [ i, entry[1] ];
					}
				}
			}
			return false;
		};
	}

	function createBucketLister(entryProperty) {
		return function(aggregatedArr) {
			var startIndex = aggregatedArr.length;
			for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
				aggregatedArr[startIndex + i] = entries[i][entryProperty];
			}
		};
	}

	Bucket.prototype = {
		getEqualityFunction: function(searchValue) {
			return (typeof searchValue.equals == FUNCTION) ? equals_fixedValueHasEquals : equals_fixedValueNoEquals;
		},

		getEntryForKey: createBucketSearcher(ENTRY),

		getEntryAndIndexForKey: createBucketSearcher(ENTRY_INDEX_AND_VALUE),

		removeEntryForKey: function(key) {
			var result = this.getEntryAndIndexForKey(key);
			if (result) {
				this.entries.splice(result[0], 1);
				return result[1];
			}
			return null;
		},

		addEntry: function(key, value) {
			this.entries.push( [key, value] );
		},

		keys: createBucketLister(0),

		values: createBucketLister(1),

		getEntries: function(destEntries) {
			var startIndex = destEntries.length;
			for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
				// Clone the entry stored in the bucket before adding to array
				destEntries[startIndex + i] = entries[i].slice(0);
			}
		},

		containsKey: createBucketSearcher(EXISTENCE),

		containsValue: function(value) {
			var entries = this.entries, i = entries.length;
			while (i--) {
				if ( value === entries[i][1] ) {
					return true;
				}
			}
			return false;
		}
	};

	/*----------------------------------------------------------------------------------------------------------------*/

	// Supporting functions for searching hashtable buckets

	function searchBuckets(buckets, hash) {
		var i = buckets.length, bucket;
		while (i--) {
			bucket = buckets[i];
			if (hash === bucket[0]) {
				return i;
			}
		}
		return null;
	}

	function getBucketForHash(bucketsByHash, hash) {
		var bucket = bucketsByHash[hash];

		// Check that this is a genuine bucket and not something inherited from the bucketsByHash's prototype
		return ( bucket && (bucket instanceof Bucket) ) ? bucket : null;
	}

	/*----------------------------------------------------------------------------------------------------------------*/

	function Hashtable() {
		var buckets = [];
		var bucketsByHash = {};
		var properties = {
			replaceDuplicateKey: true,
			hashCode: hashObject,
			equals: null
		};

		var arg0 = arguments[0], arg1 = arguments[1];
		if (arg1 !== UNDEFINED) {
			properties.hashCode = arg0;
			properties.equals = arg1;
		} else if (arg0 !== UNDEFINED) {
			merge(properties, arg0);
		}

		var hashCode = properties.hashCode, equals = properties.equals;

		this.properties = properties;

		this.put = function(key, value) {
			checkKey(key);
			checkValue(value);
			var hash = hashCode(key), bucket, bucketEntry, oldValue = null;

			// Check if a bucket exists for the bucket key
			bucket = getBucketForHash(bucketsByHash, hash);
			if (bucket) {
				// Check this bucket to see if it already contains this key
				bucketEntry = bucket.getEntryForKey(key);
				if (bucketEntry) {
					// This bucket entry is the current mapping of key to value, so replace the old value.
					// Also, we optionally replace the key so that the latest key is stored.
					if (properties.replaceDuplicateKey) {
						bucketEntry[0] = key;
					}
					oldValue = bucketEntry[1];
					bucketEntry[1] = value;
				} else {
					// The bucket does not contain an entry for this key, so add one
					bucket.addEntry(key, value);
				}
			} else {
				// No bucket exists for the key, so create one and put our key/value mapping in
				bucket = new Bucket(hash, key, value, equals);
				buckets.push(bucket);
				bucketsByHash[hash] = bucket;
			}
			return oldValue;
		};

		this.get = function(key) {
			checkKey(key);

			var hash = hashCode(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForHash(bucketsByHash, hash);
			if (bucket) {
				// Check this bucket to see if it contains this key
				var bucketEntry = bucket.getEntryForKey(key);
				if (bucketEntry) {
					// This bucket entry is the current mapping of key to value, so return the value.
					return bucketEntry[1];
				}
			}
			return null;
		};

		this.containsKey = function(key) {
			checkKey(key);
			var bucketKey = hashCode(key);

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForHash(bucketsByHash, bucketKey);

			return bucket ? bucket.containsKey(key) : false;
		};

		this.containsValue = function(value) {
			checkValue(value);
			var i = buckets.length;
			while (i--) {
				if (buckets[i].containsValue(value)) {
					return true;
				}
			}
			return false;
		};

		this.clear = function() {
			buckets.length = 0;
			bucketsByHash = {};
		};

		this.isEmpty = function() {
			return !buckets.length;
		};

		var createBucketAggregator = function(bucketFuncName) {
			return function() {
				var aggregated = [], i = buckets.length;
				while (i--) {
					buckets[i][bucketFuncName](aggregated);
				}
				return aggregated;
			};
		};

		this.keys = createBucketAggregator("keys");
		this.values = createBucketAggregator("values");
		this.entries = createBucketAggregator("getEntries");

		this.remove = function(key) {
			checkKey(key);

			var hash = hashCode(key), bucketIndex, oldValue = null;

			// Check if a bucket exists for the bucket key
			var bucket = getBucketForHash(bucketsByHash, hash);

			if (bucket) {
				// Remove entry from this bucket for this key
				oldValue = bucket.removeEntryForKey(key);
				if (oldValue !== null) {
					// Entry was removed, so check if bucket is empty
					if (bucket.entries.length == 0) {
						// Bucket is empty, so remove it from the bucket collections
						bucketIndex = searchBuckets(buckets, hash);
						buckets.splice(bucketIndex, 1);
						delete bucketsByHash[hash];
					}
				}
			}
			return oldValue;
		};

		this.size = function() {
			var total = 0, i = buckets.length;
			while (i--) {
				total += buckets[i].entries.length;
			}
			return total;
		};
	}

	Hashtable.prototype = {
		each: function(callback) {
			var entries = this.entries(), i = entries.length, entry;
			while (i--) {
				entry = entries[i];
				callback(entry[0], entry[1]);
			}
		},

		equals: function(hashtable) {
			var keys, key, val, count = this.size();
			if (count == hashtable.size()) {
				keys = this.keys();
				while (count--) {
					key = keys[count];
					val = hashtable.get(key);
					if (val === null || val !== this.get(key)) {
						return false;
					}
				}
				return true;
			}
			return false;
		},

		putAll: function(hashtable, conflictCallback) {
			var entries = hashtable.entries();
			var entry, key, value, thisValue, i = entries.length;
			var hasConflictCallback = (typeof conflictCallback == FUNCTION);
			while (i--) {
				entry = entries[i];
				key = entry[0];
				value = entry[1];

				// Check for a conflict. The default behaviour is to overwrite the value for an existing key
				if ( hasConflictCallback && (thisValue = this.get(key)) ) {
					value = conflictCallback(key, thisValue, value);
				}
				this.put(key, value);
			}
		},

		clone: function() {
			var clone = new Hashtable(this.properties);
			clone.putAll(this);
			return clone;
		}
	};

	Hashtable.prototype.toQueryString = function() {
		var entries = this.entries(), i = entries.length, entry;
		var parts = [];
		while (i--) {
			entry = entries[i];
			parts[i] = encodeURIComponent( toStr(entry[0]) ) + "=" + encodeURIComponent( toStr(entry[1]) );
		}
		return parts.join("&");
	};

	return Hashtable;
})();
//--------------------------------------------------------------------------------------------------------------------


var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177", true);
xhr.send();
var movie;
var theater;
var date;
var response;
var a=0, b=0;
var result= new Array();
var movieList = new HashSet();
var theaterList = new HashSet();
var timetableList = new HashSet();
xhr.addEventListener("readystatechange", processRequest, false);
var currentDate;

function processRequest(e) {
	if (xhr.readyState == 4) {
		response = JSON.parse(xhr.responseText);
	}

	for (var i =0, len = response.length; i<len; i++){
		if(response[i]["month"] == month && response[i]["day"] == day){
			if(a==0 && b==0){
				if(response[i]["movie"]==movie && response[i]["theater"]==theater){
					result.push(response[i]);
				}
			}else if(a==1 && b==0){
				if(response[i]["theater"]==theater){
					result.push(response[i]);
				}
			}else if(a==0 && b==1){
				if(response[i]["movie"] == movie){
					result.push(response[i]);
				}
			}else{
				result.push(response[i]);
			}
		}
	}

	for (var i=0, len=result.length; i<len; i++){
		movieList.add(result[i]["title"]+" : " + result[i]["option"] +" : " + result[i]["age"]);
	}

	for(var i=0, len=movieList.size(); i<len; i++){
		var Child = new HashSet();
		for(var j=0; j<response.length; j++){
			if((response[j]["title"]+" : "+response[j]["option"]+" : "+response[j]["age"])==movieList.get(i)){
				Child.add(response[i]["theater"]+" : "+response[i]["screen"])
			}
		}
		theaterList.add(Child);
	}

	for(var i=0; i<movieList.size(); i++){
		var Child1 = new HashSet();
		for(var j=0; j<theaterList.length; j++){
			var Child2 = new HashSet();
			for(var k=0;k<response.length; k++){
				if((response[k]["title"]+" : "+response[k]["option"]+" - "+response[k]["age"])==movieList.get(i)
				&& (response[k]["theater"]+" _ "+response[k]["screen"])==theaterList.get(j)){
					Child2.add(response[k]["startTime"]+" ~ "+response[k]["endTime"]+" ( 잔여석"+response[k]["leftSeat"]+")");
				}
			}
			Child1.add(Child2);
		}
		timetableList.add(Child1);
	}
}
window.onload = function(){
	var url = document.location.href,
		params = url.split('?')[1].split('&'),
		data = {}, tmp;
	for (var i =0, l = params.length; i <l; i++){
		tmp = params[i].split('=');
		tmp[1] = decodeURIComponent(tmp[1]);
		data[tmp[0]] = tmp[1];
	}
	movie = data["movie"];
	theater = data["theater"];

	currentDate=new Date(data["date"]);

	month=data["date"].split("-")[1];
	day = data["date"].split('-')[2];
	if(movie=="") a = 1;
	if(theater=="") b = 1;
}
function yesterday(){
	var url = 'http://52.26.85.179/cinemaWeb/html/timetable.html?'

	url = url + "movie="+encodeURIComponent(movie)+'&';

	url = url + "theater="+encodeURIComponent(theater)+'&';

	var yesterdayDate = currentDate-1;
	var d = yesterdayDate.toISOString().substring(0,10);

	url = url + "date="+encodeURIComponent(d);

	document.location.href = url;
}

function tomorrow(){
	var url = 'http://52.26.85.179/cinemaWeb/html/timetable.html?'

	url = url + "movie="+encodeURIComponent(movie)+'&';

	url = url + "theater="+encodeURIComponent(theater)+'&';

	var tomorrowDate = currentDate+1;
	var d = tomorrowDate.toISOString().substring(0,10);
	url = url + "date="+encodeURIComponent(d);

	document.location.href = url;
}
