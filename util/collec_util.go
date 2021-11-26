package util

type Filter func(model interface{}) bool

func FilterList(array []interface{}, filter Filter) []interface{} {

	var resList []interface{}
	for item, _ := range array {

		if filter(item) {
			resList = append(resList, item)
		}
	}
	return resList
}

func Counting(filter Filter) func(source []interface{}) int {

	return func(dataSource []interface{}) int {
		res := FilterList(dataSource, filter)
		return len(res)

	}

}
