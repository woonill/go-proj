package util

import (
	"database/sql"
	log "github.com/sirupsen/logrus"
)

type SQLRowMapper func(rows *sql.Rows) (interface{}, error)

type SQLParameter struct {
	Parameter interface{}
}

func ExecuteQuery(
	sql string,
	dbCon *sql.DB,
	mapper SQLRowMapper,
	params ...interface{}) ([]interface{}, error) {

	rows, err := dbCon.Query(sql, params...)

	if err != nil {
		log.Printf("error:%s , onSQL:%s", err.Error(), sql)
		log.Fatal(err)
	}

	defer rows.Close()

	var rese []interface{}

	//log.Info("Info %s","Starting read row ow")

	for rows.Next() {

		r, err := mapper(rows)
		if err != nil {
			log.Info("Info %s", "Starting read row ow")
			log.Info("Read row error:%s", err)
			return nil, err
		}

		rese = append(rese, r)
	}

	err = rows.Err()
	if err != nil {
		log.Info("SQL Error:%s", sql)
		return nil, err
	}
	return rese, nil

}

type DatabaseConnector func() (*sql.DB, error)

func BuildDefaultDatabaseConnector(dbConUrl string) DatabaseConnector {

	if dbConUrl == "" {
		log.Fatal("DB connection is nil")
	}

	return func() (*sql.DB, error) {
		return sql.Open("mysql", dbConUrl)
	}
}
